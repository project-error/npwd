import { ESX } from './server';
import events from '../utils/events';
import {
  getIdentifierByPhoneNumber,
  usePhoneNumber,
  useIdentifier,
} from './functions';
import { XPlayer } from 'esx.js/@types/server';
import { ICall } from '../../phone/src/common/typings/call';

import { pool } from './db';
import { v4 as uuidv4 } from 'uuid';
import { ConnectionStringParser } from 'connection-string-parser';
import { time } from 'console';

/**
 * Returns the player phoneNumber for a passed identifier
 * @param identifier The players phone number
 */
async function getPlayerFromIdentifier(identifier: string): Promise<XPlayer> {
  return new Promise((res, rej) => {
    const xPlayers = ESX.GetPlayers();

    for (const player of xPlayers) {
      const xPlayer = ESX.GetPlayerFromId(player);
      if (
        xPlayer.getIdentifier() != null &&
        xPlayer.getIdentifier() == identifier
      ) {
        res(xPlayer);
      }
    }

    rej(new Error('Call Target Identifier was not found in xPlayers array'));
  });
}

async function saveCall(call: ICall) {
  const query =
    'INSERT INTO npwd_calls (transmitter, receiver, start) VALUES (?, ?, ?)';
  await pool.query(query, [call.transmitter, call.receiver, call.start]);
}

async function updateCall(call: ICall, isAccepted: boolean, end?: number) {
  const query =
    'UPDATE npwd_calls SET is_accepted, end (?, ?) WHERE identifier = ?';
  await pool.query(query, [isAccepted, end, call.identifier]);
}

async function fetchCalls(phoneNumber: string): Promise<ICall[]> {
  const query =
    'SELECT * FROM npwd_calls WHERE receiver = ? OR transmitter = ?';
  const [result] = await pool.query(query, [phoneNumber, phoneNumber]);
  const calls = <ICall[]>result;
  return calls;
}

let calls: Map<string, ICall> = new Map();

onNet(
  events.PHONE_INITIALIZE_CALL,
  async (phoneNumber: string, timestamp: number) => {
    const _source = (global as any).source;

    const callIdentifier = uuidv4();

    // the client that is calling
    const xTransmitter = ESX.GetPlayerFromId(_source);
    const transmitterNumber = await usePhoneNumber(
      xTransmitter.getIdentifier()
    );

    // player who is being called
    const receiverIdentifier = await getIdentifierByPhoneNumber(phoneNumber);
    const xReceiver = await getPlayerFromIdentifier(receiverIdentifier);
    const receiverNumber = phoneNumber;

    calls.set(transmitterNumber, {
      identifier: callIdentifier,
      transmitter: transmitterNumber,
      transmitterSource: _source,
      receiver: receiverNumber,
      receiverSource: xReceiver.source,
      start: timestamp / 1000,
    });

    const currentCall = calls.get(transmitterNumber);
    await saveCall(currentCall);

    // events
    // client that is calling
    emitNet(
      events.PHONE_START_CALL,
      _source,
      transmitterNumber,
      receiverNumber,
      true
    );

    // client that is being called
    emitNet(
      events.PHONE_START_CALL,
      xReceiver.source,
      transmitterNumber,
      receiverNumber,
      false
    );
  }
);

onNet(events.PHONE_ACCEPT_CALL, async (transmitterNumber: string) => {
  try {
    const pSource = (global as any).source;

    const currentCall = calls.get(transmitterNumber);
    const channelId = pSource;

    await updateCall(currentCall, true);

    // player who is being called
    emitNet(
      events.PHONE_CALL_WAS_ACCEPTED,
      pSource,
      channelId,
      currentCall,
      false
    );

    // player who is calling
    emitNet(
      events.PHONE_CALL_WAS_ACCEPTED,
      currentCall.transmitterSource,
      channelId,
      currentCall,
      true
    );
  } catch (error) {
    console.log(error, error.message);
  }
});

onNet(
  events.PHONE_CALL_REJECTED,
  async (transmitterNumber: string, timestamp: number) => {
    try {
      const pSource = (global as any).source;
      const currentCall = calls.get(transmitterNumber);

      await updateCall(currentCall, false, timestamp);
      // player who is being called
      emitNet(events.PHONE_CALL_WAS_REJECTED, pSource);

      // player who is calling
      emitNet(events.PHONE_CALL_WAS_REJECTED, currentCall.transmitterSource);
    } catch (error) {
      console.log(error, error.message);
    }
  }
);

onNet(
  events.PHONE_END_CALL,
  async (transmitterNumber: string, timestamp: number) => {
    try {
      const pSource = (global as any).source;
      const currentCall = calls.get(transmitterNumber);

      const endTime = timestamp / 1000;

      await updateCall(currentCall, false, endTime);

      // player who is being called
      emitNet(events.PHONE_CALL_WAS_ENDED, currentCall.receiverSource);
      // player who is calling
      emitNet(events.PHONE_CALL_WAS_ENDED, currentCall.transmitterSource);

      calls.delete(transmitterNumber);
    } catch (error) {
      console.log(error, error.message);
    }
  }
);

onNet(events.PHONE_CALL_FETCH_CALLS, async () => {
  const _source = (global as any).source;
  const identifier = await useIdentifier();
  const phoneNumber = await usePhoneNumber(identifier);

  const calls = await fetchCalls(phoneNumber);

  emitNet(events.PHONE_CALL_SEND_HISTORY, _source, calls);
});
