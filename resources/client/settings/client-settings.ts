import { RegisterNuiCB } from '../cl_utils';
import { IPhoneSettings, KvpItems, SettingEvents } from '../../../typings/settings';
import KvpService from './client-kvp.service';
import { Sound } from '../sounds/client-sound.class';
import { Ringtone } from '../sounds/client-ringtone.class';

// This will run once we first load NUI settings stored in localStorage, and every time
// we update it.
RegisterNuiCB<IPhoneSettings>(SettingEvents.NUI_SETTINGS_UPDATED, (cfg, cb) => {
  global.exports['pma-voice'].setCallVolume(cfg.callVolume);

  KvpService.setKvp(KvpItems.NPWD_RINGTONE, cfg.ringtone.value);
  KvpService.setKvp(KvpItems.NPWD_NOTIFICATION, cfg.notiSound.value);
  KvpService.setKvpInt(KvpItems.NPWD_VOLUME, cfg.allNotifVolume);
  KvpService.setKvpInt(KvpItems.NPWD_VIBROR, cfg.vibrorMode ? 1 : 0);
  cb({});
});

// Play an alert when previewing notification sound
RegisterNuiCB(SettingEvents.PREVIEW_ALERT, () => {
  if (Ringtone.isPlaying()) return;

  const notifSoundset = KvpService.getKvpString(KvpItems.NPWD_NOTIFICATION);
  const volume = KvpService.getKvpInt(KvpItems.NPWD_VOLUME);
  const sound = new Ringtone(notifSoundset, volume, 0, false);
  sound.play();
});

// Play ringtone for 3 seconds when previewing ringtone
RegisterNuiCB(SettingEvents.PREVIEW_RINGTONE, () => {
  if (Ringtone.isPlaying()) return;

  const ringtoneSound = KvpService.getKvpString(KvpItems.NPWD_RINGTONE);
  const volume = KvpService.getKvpInt(KvpItems.NPWD_VOLUME);
  const ringtone = new Ringtone(ringtoneSound, volume, 0, false);
  ringtone.play();
  setTimeout(ringtone.stop, 3000);
});
