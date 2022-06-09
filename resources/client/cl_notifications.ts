import { RegisterNuiCB } from './cl_utils';
import { AlertEvents } from '@typings/alerts';
import KvpService from './settings/client-kvp.service';
import { KvpItems } from '@typings/settings';
import { Ringtone } from './sounds/client-ringtone.class';

RegisterNuiCB(AlertEvents.PLAY_ALERT, () => {
  const notifSoundset = KvpService.getKvpString(KvpItems.NPWD_NOTIFICATION);
  const volume = KvpService.getKvpInt(KvpItems.NPWD_VOLUME);
  const vibror = KvpService.getKvpInt(KvpItems.NPWD_VIBROR);
  const sound = new Ringtone(notifSoundset, volume, vibror, false);
  sound.play();
});
