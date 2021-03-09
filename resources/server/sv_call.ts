import events from '../utils/events';
import { getIdentifierByPhoneNumber, getPlayer, getSource } from './functions';

import { getPlayerFromIdentifier } from './functions';
import { ICall } from '../../phone/src/common/typings/call';

import { pool } from './db';
import { v4 as uuidv4 } from 'uuid';
import { mainLogger } from './sv_logger';

const callLogger = mainLogger.child({ module: 'calls' });

async function saveCall(call: ICall) {
  const query =
    'INSERT INTO npwd_calls (identifier, transmitter, receiver, start) VALUES (?, ?, ?, ?)';
  await pool.query(query, [call.identifier, call.transmitter, call.receiver, call.start]);
}

async function updateCall(call: ICall, isAccepted: boolean, end: number) {
  const query = 'UPDATE npwd_calls SET is_accepted=?, end=? WHERE identifier = ?';
  await pool.query(query, [isAccepted, end, call.identifier]);
}

async function fetchCalls(phoneNumber: string): Promise<ICall[]> {
  const query = 'SELECT * FROM npwd_calls WHERE receiver = ? OR transmitter = ? ORDER BY id DESC';
  const [result] = await pool.query(query, [phoneNumber, phoneNumber]);
  const calls = <ICall[]>result;
  return calls;
}

let calls: Map<string, ICall> = new Map();

onNet(events.PHONE_INITIALIZE_CALL, async (phoneNumber: string, timestamp: number) => {
  const _source = getSource();

  const callIdentifier = uuidv4();

  // the client that is calling
  // TODO: Handle offline player calling
  const transmitterNumber = getPlayer(_source).getPhoneNumber();

  // player who is being called
  const receiverIdentifier = await getIdentifierByPhoneNumber(phoneNumber);
  const xReceiver = getPlayerFromIdentifier(receiverIdentifier);
  const receiverNumber = phoneNumber;

  calls.set(transmitterNumber, {
    identifier: callIdentifier,
    transmitter: transmitterNumber,
    transmitterSource: _source,
    receiver: receiverNumber,
    receiverSource: xReceiver.source,
    start: timestamp / 1000,
    accepted: false,
  });

  const currentCall = calls.get(transmitterNumber);
  await saveCall(currentCall);

  // events
  // client that is calling
  emitNet(events.PHONE_START_CALL, _source, transmitterNumber, receiverNumber, true);

  // client that is being called
  emitNet(events.PHONE_START_CALL, xReceiver.source, transmitterNumber, receiverNumber, false);
});

onNet(events.PHONE_ACCEPT_CALL, async (transmitterNumber: string) => {
  const pSource = getSource();
  try {
    const currentCall = calls.get(transmitterNumber);
    const channelId = pSource;

    await updateCall(currentCall, true, null);

    // player who is being called
    emitNet(events.PHONE_CALL_WAS_ACCEPTED, pSource, channelId, currentCall, false);

    // player who is calling
    emitNet(
      events.PHONE_CALL_WAS_ACCEPTED,
      currentCall.transmitterSource,
      channelId,
      currentCall,
      true,
    );

    currentCall.accepted = true;
  } catch (e) {
    callLogger.error('Accepting Call Error', e.message, {
      source: pSource,
    });
  }
});

onNet(events.PHONE_CALL_REJECTED, async (transmitterNumber: string, timestamp: number) => {
  const pSource = getSource();
  try {
    const currentCall = calls.get(transmitterNumber);
    await updateCall(currentCall, false, timestamp);

    // player who is called and initiasted the rejection.
    emitNet(events.PHONE_CALL_WAS_REJECTED, currentCall.receiverSource);
    // player who is calling and recieved the rejection.
    emitNet(events.PHONE_CALL_WAS_REJECTED, currentCall.transmitterSource);
  } catch (e) {
    callLogger.error(`Phone Call Rejected Event Error ${e.message}`, {
      source: pSource,
    });
  }
});

onNet(events.PHONE_END_CALL, async (transmitterNumber: string, timestamp: number) => {
  const pSource = getSource();
  try {
    const currentCall = calls.get(transmitterNumber);
    const endTime = timestamp / 1000;
    await updateCall(currentCall, false, endTime);
    const accepted = calls.get(pSource);

    // player who is being called
    emitNet(events.PHONE_CALL_WAS_ENDED, currentCall.receiverSource);
    // player who is calling
    emitNet(events.PHONE_CALL_WAS_ENDED, currentCall.transmitterSource);
    // ends animations if call is active
    if (currentCall.accepted) {
      emitNet(events.PHONE_CALL_SEND_HANGUP_ANIM, currentCall.receiverSource);
      emitNet(events.PHONE_CALL_SEND_HANGUP_ANIM, currentCall.transmitterSource);
    }
    calls.delete(transmitterNumber);
  } catch (e) {
    callLogger.error(`Error ending Phone Call, ${e.message}`, {
      source: pSource,
    });
  }
});

onNet(events.PHONE_CALL_FETCH_CALLS, async () => {
  const _source = getSource();
  try {
    const phoneNumber = getPlayer(_source).getPhoneNumber();
    const calls = await fetchCalls(phoneNumber);
    emitNet(events.PHONE_CALL_SEND_HISTORY, _source, calls);
  } catch (e) {
    callLogger.error(`Failed to fetch calls, ${e.message}`, {
      source: _source,
    });
  }
});
