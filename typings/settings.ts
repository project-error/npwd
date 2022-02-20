import { SETTING_MENTIONS, SETTINGS_ALL_TWEETS } from './twitter';

export interface IconSetObject {
  custom: boolean;
  name: string;
}

export interface SettingOption<T = string | number> {
  label: string;
  value: T;
}

export interface IPhoneSettings {
  language: SettingOption<string>;
  iconSet: SettingOption<IconSetObject>;
  wallpaper: SettingOption<string>;
  frame: SettingOption;
  theme: SettingOption<string>;
  zoom: SettingOption<number>;
  streamerMode: boolean;
  ringtone: SettingOption;
  ringtoneVol: number;
  callVolume: number;
  notiSound: SettingOption;
  notiSoundVol: number;
  TWITTER_notiFilter: SettingOption<string>;
  TWITTER_notiSound: SettingOption;
  TWITTER_notiSoundVol: number;
  TWITTER_notifyNewFeedTweet: boolean;
  MARKETPLACE_notifyNewListing: boolean;
}

export enum SettingEvents {
  NUI_SETTINGS_UPDATED = 'npwd:nuiSettingsUpdated',
}
