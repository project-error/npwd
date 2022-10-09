import { RegisterNuiCB } from '../cl_utils';
import { IPhoneSettings, KvpItems, SettingEvents } from '../../../typings/settings';
import KvpService from './client-kvp.service';
import { Sound } from '../sounds/client-sound.class';
import { Ringtone } from '../sounds/client-ringtone.class';

const PHONE_PROPS: Record<string, number> = Object.freeze({
  gold: 3,
  default: 7,
  minimal: 7,
  blue: 0,
  pink: 6,
  white: 4,
});

// 1 - green
// 2 - red
// 3 - gold
// 4 - white / gray
// 5 - purple
// 6 - pink
// 7 - black

// This will run once we first load NUI settings stored in localStorage, and every time
// we update it.
RegisterNuiCB<IPhoneSettings>(SettingEvents.NUI_SETTINGS_UPDATED, (cfg, cb) => {
  global.exports['pma-voice'].setCallVolume(cfg.callVolume);

  KvpService.setKvp(KvpItems.NPWD_RINGTONE, cfg.ringtone.value);
  KvpService.setKvp(KvpItems.NPWD_NOTIFICATION, cfg.notiSound.value);
  const frameValue: string = cfg.frame.value;
  const frameName = frameValue.substr(0, frameValue.lastIndexOf('.'));
  KvpService.setKvpInt(KvpItems.NPWD_FRAME, PHONE_PROPS[frameName]);
  SetObjectTextureVariation(global.phoneProp, PHONE_PROPS[frameName]);
  cb({});
});

// Play an alert when previewing notification sound
RegisterNuiCB(SettingEvents.PREVIEW_ALERT, () => {
  const notifSoundset = KvpService.getKvpString(KvpItems.NPWD_NOTIFICATION);
  const sound = new Sound('Text_Arrive_Tone', notifSoundset);
  sound.play();
});

// Play ringtone for 3 seconds when previewing ringtone
RegisterNuiCB(SettingEvents.PREVIEW_RINGTONE, () => {
  if (Ringtone.isPlaying()) return;

  const ringtoneSound = KvpService.getKvpString(KvpItems.NPWD_RINGTONE);
  const ringtone = new Ringtone(ringtoneSound);
  ringtone.play();
  setTimeout(ringtone.stop, 3000);
});
