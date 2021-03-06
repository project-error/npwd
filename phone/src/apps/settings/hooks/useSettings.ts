import { atom, DefaultValue, SetterOrUpdater, useRecoilState } from 'recoil';

import { SETTINGS_ALL_TWEETS, SETTING_MENTIONS } from '../../../common/typings/twitter';
import config from '../../../config/default.json';
import { SettingOption } from '../../../ui/hooks/useContextMenu';

const localStorageEffect = (key) => ({ setSelf, onSet }) => {
  const savedVal = localStorage.getItem(key);
  if (savedVal != null) {
    setSelf(JSON.parse(savedVal));
  }

  onSet((newValue) => {
    if (newValue instanceof DefaultValue) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, JSON.stringify(newValue));
    }
  });
};

export const settingsState = atom({
  key: 'settings',
  default: config.defaultSettings,
  effects_UNSTABLE: [localStorageEffect('npwd_settings')],
});

export interface IPhoneSettings {
  wallpaper: SettingOption;
  frame: SettingOption;
  theme: SettingOption;
  zoom: SettingOption;
  ringtone: SettingOption;
  ringtoneVol: number;
  notiSound: SettingOption;
  notiSoundVol: number;
  TWITTER_notiFilter: SettingOption<SETTING_MENTIONS | SETTINGS_ALL_TWEETS>;
  TWITTER_notiSound: SettingOption;
  TWITTER_notiSoundVol: number;
  TWITTER_notifyNewFeedTweet: boolean;
}

export const useSettings = (): [IPhoneSettings, SetterOrUpdater<any>] => {
  return useRecoilState(settingsState);
};
