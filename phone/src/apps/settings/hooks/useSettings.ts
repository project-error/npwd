import { atom, DefaultValue, useRecoilState } from 'recoil';
import config from '../../../config/default.json';
import { SettingOption } from '../../../ui/hooks/useContextMenu';

export interface IPhoneSettings {
  wallpaper: SettingOption;
  frame: SettingOption;
  theme: SettingOption;
  zoom: SettingOption;
  ringtone: SettingOption;
  ringtoneVol: number;
  notiSound: SettingOption;
  notiSoundVol: number;
  TWITTER_notiSound: SettingOption;
  TWITTER_notiSoundVol: number;
  TWITTER_notifyNewFeedTweet: boolean;
}

export class PhoneSettings implements IPhoneSettings {
  wallpaper: SettingOption;
  frame: SettingOption;
  theme: SettingOption;
  zoom: SettingOption;
  ringtone: SettingOption;
  ringtoneVol: number;
  notiSound: SettingOption;
  notiSoundVol: number;
  TWITTER_notiSound: SettingOption;
  TWITTER_notiSoundVol: number;
  TWITTER_notifyNewFeedTweet: boolean;

  constructor(value: Partial<IPhoneSettings>, defaultSettings: IPhoneSettings) {
    return this.validate(value, defaultSettings);
  }

  validate(value, defaultSettings) {
    Object.keys(this).map((key) => {
      if (value[key] === undefined || typeof value[key] !== typeof defaultSettings[key]) {
        this[key] = defaultSettings[key];
        return key;
      }
      this[key] = value[key];
      return key;
    });
    return this;
  }
}

export const localStorageEffect = (key) => ({ setSelf, onSet }) => {
  const storedSettings = localStorage.getItem(key);
  if (storedSettings) {
    try {
      const validated = new PhoneSettings(JSON.parse(storedSettings), config.defaultSettings);
      setSelf(validated);
    } catch (e) {
      console.error('Local storage parse error, restoring to defaults', e.message);
      setSelf(config.defaultSettings);
    }
  }

  onSet((settingValue) => {
    if (settingValue instanceof DefaultValue) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, JSON.stringify(settingValue));
    }
  });
};

export const settingsState = atom({
  key: 'settings',
  default: config.defaultSettings,
  effects_UNSTABLE: [localStorageEffect('npwd_settings')],
});

export const useSettings = () => {
  const [settings, setSettings] = useRecoilState(settingsState);

  const resetSettings = () => {
    setSettings(config.defaultSettings);
  };

  return { settings, setSettings, resetSettings };
};
