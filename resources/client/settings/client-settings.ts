import { RegisterNuiCB } from '../cl_utils';
import { IPhoneSettings, SettingEvents } from '../../../typings/settings';
import KvpService from './client-kvp.service';

// This will run once we first load NUI settings stored in localStorage, and every time
// we update it.
RegisterNuiCB<IPhoneSettings>(SettingEvents.NUI_SETTINGS_UPDATED, (cfg, cb) => {
  console.log('BIG THING');
  console.log(cfg);
  global.exports['pma-voice'].setCallVolume(cfg.callVolume);

  KvpService.setKvp('npwd-ringtone', cfg.ringtone.value);
  cb({});
});
