import { ESX } from './server';
import events from '../utils/events';
import { getIdentifierByPhoneNumber, usePhoneNumber } from './functions';
import { XPlayer } from 'esx.js/@types/server';
import { ICall } from '../../phone/src/common/typings/call'
import { constants } from 'buffer';

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

let calls: Map<string, ICall> = new Map()

onNet(events.PHONE_INITIALIZE_CALL, async (phoneNumber: string) => {
  const _source = (global as any).source;

  console.log("BIG DICK FOR LISA ANN")

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
    receiver: receiverNumber,
    receiverSource: xReceiver.source
  })
  

  // events
  // client that is calling
  emitNet(events.PHONE_START_CALL, _source, transmitterNumber, receiverNumber, true);

  // client that is being called
  emitNet(events.PHONE_START_CALL, xReceiver.source, transmitterNumber, receiverNumber, false);

})

onNet(events.PHONE_ACCEPT_CALL, (transmitterNumber: string) => {
  try {
    const pSource = (global as any).source

    const currentCall = calls.get(transmitterNumber)
    const channelId = pSource

    // player who is being called
    emitNet(events.PHONE_CALL_WAS_ACCEPTED, pSource, channelId, currentCall, false)

    // player who is calling
    emitNet(events.PHONE_CALL_WAS_ACCEPTED, currentCall.transmitterSource, channelId, currentCall, true)

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

onNet(events.PHONE_END_CALL, (transmitterNumber: string) => {
  console.log("TRANSMITTER NUMBER:", transmitterNumber)
  try {
    const pSource = (global as any).source
    const currentCall = calls.get(transmitterNumber)

    console.log("CURRENT CALL", currentCall)

    console.log("SOURCE:", pSource)
    console.log("TRANSMITTER:", currentCall.transmitterSource)
    console.log("RECEIVER:", currentCall.receiverSource)

    // player who is being called
    emitNet(events.PHONE_CALL_WAS_ENDED, currentCall.receiverSource)
    emitNet(events.PHONE_CALL_WAS_ENDED, pSource)

    // player who is calling
    emitNet(events.PHONE_CALL_WAS_ENDED, currentCall.transmitterSource)
    if (pSource === currentCall.transmitterSource) {
      console.log("I am the transmitter")
    }


    //calls.delete(transmitterNumber)
  

  } catch (error) {
    console.log(error, error.message)
  }
})