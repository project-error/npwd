import { ESX } from './server';
import events from '../utils/events';
import { getIdentifierByPhoneNumber, usePhoneNumber, useIdentifier} from './functions';
import { XPlayer } from 'esx.js/@types/server';
import { ICall, ICallUI } from '../../phone/src/common/typings/call'

import { pool } from './db';
import { reverse } from 'dns';

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


async function saveCall(call: ICall, isAccepted: boolean) {
  const query = "INSERT INTO npwd_calls (transmitter, receiver, accepted, is_caller) VALUES (?, ?)"
  await pool.query(query, [call.transmitter, call.receiver, isAccepted])
}

async function updateCall(call: ICall, isAccepted: boolean) {
  const query = "UPDATE npwd_calls SET is_accepted (?) WHERE trasmitter = ?";
  await pool.query(query, [isAccepted, call.transmitter])
}

async function fetchCalls(phoneNumber: string): Promise<ICallUI[]> {
  const query = "SELECT * FROM npwd_calls WHERE receiver = ? OR transmitter = ?"
  const [result] = await pool.query(query, [phoneNumber, phoneNumber])
  const calls = <ICallUI[]>result
  return calls;
}

let calls: Map<string, ICall> = new Map()


onNet(events.PHONE_INITIALIZE_CALL, async (phoneNumber: string) => {
  const _source = (global as any).source;

  // the client that is calling
  const xTransmitter = ESX.GetPlayerFromId(_source);
  const transmitterNumber = await usePhoneNumber(xTransmitter.getIdentifier());

  // player who is being called
  const receiverIdentifier = await getIdentifierByPhoneNumber(phoneNumber);
  const xReceiver = await getPlayerFromIdentifier(receiverIdentifier);
  const receiverNumber = phoneNumber

  calls.set(transmitterNumber, {
    transmitter: transmitterNumber, 
    transmitterSource: _source,
    transmitterIdentifier: xTransmitter.getIdentifier(),
    receiver: receiverNumber,
    receiverSource: xReceiver.source,
    receiverIdentifier: receiverIdentifier
  }) 
  
  // events
  // client that is calling
  emitNet(events.PHONE_START_CALL, _source, transmitterNumber, receiverNumber, true);

  // client that is being called
  emitNet(events.PHONE_START_CALL, xReceiver.source, transmitterNumber, receiverNumber, false);

  const currentCall = calls.get(transmitterNumber)

  await saveCall(currentCall, false)

})


onNet(events.PHONE_ACCEPT_CALL, async (transmitterNumber: string) => {
  try {
    const pSource = (global as any).source

    const currentCall = calls.get(transmitterNumber)
    const channelId = pSource

    // player who is being called
    emitNet(events.PHONE_CALL_WAS_ACCEPTED, pSource, channelId, currentCall, false)

    // player who is calling
    emitNet(events.PHONE_CALL_WAS_ACCEPTED, currentCall.transmitterSource, channelId, currentCall, true)

    await updateCall(currentCall, true);

  } catch (error) {
    console.log(error, error.message)
  }
})


onNet(events.PHONE_CALL_REJECTED, (transmitterNumber: string) => {
  try {
    const pSource = (global as any).source;
    const currentCall = calls.get(transmitterNumber);

    // player who is being called
    emitNet(events.PHONE_CALL_WAS_REJECTED, pSource);
    
    // player who is calling
    emitNet(events.PHONE_CALL_WAS_REJECTED, currentCall.transmitterSource);

  } catch (error) {
    console.log(error, error.message)
  }
})


onNet(events.PHONE_END_CALL, async (transmitterNumber: string) => {
  try {
    const pSource = (global as any).source
    const currentCall = calls.get(transmitterNumber)

    // player who is being called
    emitNet(events.PHONE_CALL_WAS_ENDED, currentCall.receiverSource)
    // player who is calling
    emitNet(events.PHONE_CALL_WAS_ENDED, currentCall.transmitterSource)

    await updateCall(currentCall, true)
    
    calls.delete(transmitterNumber)
  

  } catch (error) {
    console.log(error, error.message)
  }
})


onNet(events.PHONE_CALL_FETCH_CALLS, async () => {
  const _source = (global as any).source;
  const identifier = await useIdentifier()
  const phoneNumber = await usePhoneNumber(identifier)

  const calls = await fetchCalls(phoneNumber)

  
  emitNet(events.PHONE_CALL_SEND_HISTORY, _source, calls)
})