import { RegisterNuiCB } from './cl_utils';
import { AlertEvents } from '@typings/alerts';
import KvpService from './settings/client-kvp.service';
import { KvpItems } from '@typings/settings';
import { Sound } from './sounds/client-sound.class';

RegisterNuiCB(AlertEvents.PLAY_ALERT, () => {
  const notifSoundset = KvpService.getKvpString(KvpItems.NPWD_NOTIFICATION);
  const sound = new Sound('Text_Arrive_Tone', notifSoundset);
  sound.play();
});
