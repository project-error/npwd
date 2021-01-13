import { ESX } from './server';
import events from '../utils/events';
import { getIdentifierByPhoneNumber, getPhoneNumberFromID } from './functions';
import { XPlayer } from 'esx.js/@types/server';
/**
 * Returns the player phoneNumber for a passed identifier
 * @param identifier The players phone number
 */
function getPlayerFromIdentifier(identifier: string): Promise<XPlayer> {
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

onNet(events.PHONE_BEGIN_CALL, async (phoneNumber: string) => {
  const callSource = (global as any).source;
  const xPlayer = ESX.GetPlayerFromId(callSource);

  const _identifier = xPlayer.getIdentifier();
  const callerName = xPlayer.getName();
  const callerNumber = getPhoneNumberFromID(_identifier);

  try {
    const targetPlayer = await getPlayerFromIdentifier(phoneNumber);
    const targetName = xPlayer.getName();

    emitNet(
      events.PHONE_START_CALL,
      targetPlayer.source,
      callerName,
      phoneNumber
    );
    emitNet(events.PHONE_START_CALL, targetName, callerNumber);
  } catch (e) {
    console.error(e);
    emit(events.PHONE_CALL_ERORR, callSource);
  }
});
