import { SETTING_MENTIONS, SETTINGS_ALL_TWEETS } from './twitter';

export interface IconSetObject {
  custom: boolean;
  name: string;
}

export interface SettingOption<T = any> {
  label: string;
  value: T | string | number;
}

export enum KvpItems {
  NPWD_RINGTONE = 'npwd-ringtone',
  NPWD_NOTIFICATION = 'npwd-notification',
  NPWD_FRAME = 'npwd-frame',
}

export type IPhoneLocalStorage = {
  [key: string]: IPhoneSettings;
};

export interface IPhoneSettings {
  language: SettingOption;
  iconSet: SettingOption<IconSetObject>;
  wallpaper: SettingOption;
  frame: SettingOption;
  theme: SettingOption;
  zoom: SettingOption;
  streamerMode: boolean;
  anonymousMode: boolean;
  ringtone: SettingOption;
  callVolume: number;
  notiSound: SettingOption;
  TWITTER_notiFilter: SettingOption<SETTING_MENTIONS | SETTINGS_ALL_TWEETS>;
  TWITTER_notiSound: SettingOption;
  TWITTER_notiSoundVol: number;
  TWITTER_notifyNewFeedTweet: boolean;
  MARKETPLACE_notifyNewListing: boolean;
}

export enum SettingEvents {
  NUI_SETTINGS_UPDATED = 'npwd:nuiSettingsUpdated',
  PREVIEW_ALERT = 'npwd:previewAlert',
  PREVIEW_RINGTONE = 'npwd:previewRingtone',
}
