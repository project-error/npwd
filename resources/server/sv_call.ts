import { ESX } from './server';
import events from '../utils/events';
import { getIdentifierByPhoneNumber, usePhoneNumber } from './functions';


function getSourceFromIdentifier(identifier: string, cb: Function) {
  const xPlayers = ESX.GetPlayers();

  for (let i = 0; i < xPlayers; i++) {
    const xPlayer = ESX.GetPlayerFromId(xPlayers[i]);
    if (xPlayer.getIdentifier() != null && xPlayer.getIdentifier() == identifier) {
      cb(xPlayer.source)
      return;
    }
  }
  cb(null);
}

onNet(events.PHONE_BEGIN_CALL, async (phoneNumber: string) => {
  const pSource = (global as any).source;
  const xPlayer = ESX.GetPlayerFromId(pSource);

  const _identifier = xPlayer.getIdentifier()
  const callerName = xPlayer.getName()
  const callerNumber = usePhoneNumber(_identifier);

  const targetIdentifier = await getIdentifierByPhoneNumber(phoneNumber);
  getSourceFromIdentifier(targetIdentifier, (target: any) => {
    const xTarget = ESX.GetPlayerFromId(target);
    const targetName = xTarget.getName()
    emitNet(events.PHONE_START_CALL, target, callerName, callerNumber, pSource);
    emitNet(events.PHONE_START_CALL, pSource, targetName, phoneNumber, target);
  })
})
