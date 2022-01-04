import { RegisterNuiCB } from '../cl_utils';
import { IPhoneSettings, SettingEvents } from '../../../typings/settings';

// This will run once we first load NUI settings stored in localStorage, and every time
// we update it.
RegisterNuiCB<IPhoneSettings>(SettingEvents.NUI_SETTINGS_UPDATED, (cfg, cb) => {
  exports['pma-voice'].setCallVolume(cfg.callVolume);
  cb({});
});
