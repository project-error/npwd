import { RegisterNuiCB } from './cl_utils';
import { AlertEvents } from '@typings/alerts';
import KvpService from './settings/client-kvp.service';
import { KvpItems } from '@typings/settings';
import { Sound } from './sounds/client-sound.class';

export const NotificationFuncRefs = new Map<string, Function>();

RegisterNuiCB(AlertEvents.PLAY_ALERT, () => {
  const notifSoundset = KvpService.getKvpString(KvpItems.NPWD_NOTIFICATION);
  const sound = new Sound('Text_Arrive_Tone', notifSoundset);
  sound.play();
});

RegisterNuiCB('npwd:onNotificationConfirm', (notisId, cb) => {
  const funcRef = NotificationFuncRefs.get(`${notisId}:confirm`);
  if (!funcRef)
    return console.log(`NPWD could not find any function ref for notification: ${notisId}`);
  funcRef();

  // delete as controls are only available when the notifiation persist.
  // if we need a option to store these notis in the top bar, this should be removed.
  NotificationFuncRefs.delete(`${notisId}:confirm`);
  cb({});
});

RegisterNuiCB('npwd:onNotificationCancel', (notisId, cb) => {
  const funcRef = NotificationFuncRefs.get(`${notisId}:cancel`);
  if (!funcRef)
    return console.log(`NPWD could not find any function ref for notification: ${notisId}`);
  funcRef();

  // delete as controls are only available when the notifiation persist.
  // if we need a option to store these notis in the top bar, this should be removed.
  NotificationFuncRefs.delete(`${notisId}:cancel`);
  cb({});
});
