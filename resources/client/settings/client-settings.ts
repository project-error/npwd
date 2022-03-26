import { RegisterNuiCB } from '../cl_utils';
import { IPhoneSettings, KvpItems, SettingEvents } from '../../../typings/settings';
import KvpService from './client-kvp.service';

// This will run once we first load NUI settings stored in localStorage, and every time
// we update it.
RegisterNuiCB<IPhoneSettings>(SettingEvents.NUI_SETTINGS_UPDATED, (cfg, cb) => {
  global.exports['pma-voice'].setCallVolume(cfg.callVolume);

  KvpService.setKvp(KvpItems.NPWD_RINGTONE, cfg.ringtone.value);
  KvpService.setKvp(KvpItems.NPWD_NOTIFICATION, cfg.notiSound.value);
  cb({});
});
