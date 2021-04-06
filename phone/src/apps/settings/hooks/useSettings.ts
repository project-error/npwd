import { atom, DefaultValue, useRecoilState, useResetRecoilState } from 'recoil';
import { SETTINGS_ALL_TWEETS, SETTING_MENTIONS } from '../../../../../typings/twitter';
import config from '../../../config/default.json';
import { SettingOption } from '../../../ui/hooks/useContextMenu';
import { Schema, Validator } from 'jsonschema';

const NPWD_STORAGE_KEY = 'npwd_settings';

const v = new Validator();

const settingOptionSchema: Schema = {
  id: '/SettingOption',
  type: 'object',
  properties: {
    label: { type: 'string' },
    val: { type: 'string' },
  },
  required: true,
};

const settingsSchema: Schema = {
  type: 'object',
  properties: {
    language: { $ref: '/SettingOption' },
    wallpaper: { $ref: '/SettingOption' },
    customWallpaper: { type: 'string' },
    frame: { $ref: '/SettingOption' },
    theme: { $ref: '/SettingOption' },
    zoom: { $ref: '/SettingOption' },
    streamerMode: { type: 'boolean' },
    ringtone: { $ref: '/SettingOption' },
    ringtoneVol: { type: 'number' },
    notiSound: { $ref: '/SettingOption' },
    notiSoundVol: { type: 'number' },
    TWITTER_notiFilter: { $ref: '/SettingOption' },
    TWITTER_notiSound: { $ref: '/SettingOption' },
    TWITTER_notiSoundVol: { type: 'number' },
    TWITTER_notifyNewFeedTweet: { type: 'boolean' },
  },
  required: true,
};

v.addSchema(settingOptionSchema, '/SettingOption');

function isSchemaValid(schema: string): boolean {
  const storedSettings = JSON.parse(schema);
  const resp = v.validate(storedSettings, settingsSchema);
  return resp.valid;
}

export function isSettingsSchemaValid(): boolean {
  const localStore = localStorage.getItem(NPWD_STORAGE_KEY);
  if (localStore) {
    try {
      const parsedSettings = JSON.parse(localStore);
      return v.validate(parsedSettings, settingsSchema).valid;
    } catch (e) {
      console.error('Unable to parse settings JSON', e);
    }
  }
  return true;
}

export interface IPhoneSettings {
  language: SettingOption;
  wallpaper: SettingOption;
  customWallpaper: string;
  frame: SettingOption;
  theme: SettingOption;
  zoom: SettingOption;
  streamerMode: boolean;
  ringtone: SettingOption;
  ringtoneVol: number;
  notiSound: SettingOption;
  notiSoundVol: number;
  TWITTER_notiFilter: SettingOption<SETTING_MENTIONS | SETTINGS_ALL_TWEETS>;
  TWITTER_notiSound: SettingOption;
  TWITTER_notiSoundVol: number;
  TWITTER_notifyNewFeedTweet: boolean;
}

const localStorageEffect = (key) => ({ setSelf, onSet }) => {
  const savedVal = localStorage.getItem(key);
  if (savedVal) {
    try {
      const validString = isSchemaValid(savedVal);
      if (validString) {
        setSelf(JSON.parse(savedVal));
      } else {
        console.error('Settings Schema was invalid, applying default settings');
        setSelf(config.defaultSettings);
      }
    } catch (e) {
      // If we are unable to parse the json string, we set default settings
      console.error('Unable to parse JSON');
      setSelf(config.defaultSettings);
    }
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
  effects_UNSTABLE: [localStorageEffect(NPWD_STORAGE_KEY)],
});

const customWallpaperState = atom({
  key: 'customWallpaperState',
  default: false,
});

export const useSettings = () => {
  return useRecoilState(settingsState);
};

export const useResetSettings = () => {
  return useResetRecoilState(settingsState);
};

export const useCustomWallpaperModal = () => {
  const [customWallpaperModal, setCustomWallpaperModal] = useRecoilState(customWallpaperState);
  return { customWallpaperModal, setCustomWallpaperModal };
};
