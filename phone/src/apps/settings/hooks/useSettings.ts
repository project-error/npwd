import { atom, DefaultValue, useRecoilState } from 'recoil';
import config from '../../../config/default.json';

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
  effects_UNSTABLE: [localStorageEffect('settings')],
});

export interface IPhoneSettings {
  wallpaper: string;
  frame: string;
  theme: string;
  zoom: number;
  ringtone: string;
  ringtoneVol: number;
  notification: string;
  notificationVol: number;
  TWITTER_notification: string;
  TWITTER_notificationVol: number;
  TWITTER_notifyNewFeedTweet: boolean;
}

export const useSettings = () => {
  return useRecoilState<IPhoneSettings>(settingsState);
};
