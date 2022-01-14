import { atom, AtomEffect, DefaultValue } from 'recoil';
import { IPhoneSettings, SettingEvents } from '@typings/settings';
import config from '../../../config/default.json';
import fetchNui from '@utils/fetchNui';
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

const iconSetValueSchema: Schema = {
  id: '/IconSetValue',
  type: 'object',
  properties: {
    name: { type: 'string' },
    custom: { type: 'boolean' },
  },
  required: true,
};

const settingOptionIconSet: Schema = {
  id: '/SettingOptionIconSet',
  type: 'object',
  properties: {
    label: { type: 'string' },
    value: { $ref: '/IconSetValue' },
  },
  required: true,
};

v.addSchema(iconSetValueSchema, '/IconSetValue');
v.addSchema(settingOptionIconSet, '/SettingOptionIconSet');

const settingsSchema: Schema = {
  type: 'object',
  properties: {
    callVolume: { type: 'number', required: true },
    iconSet: { $ref: '/SettingOptionIconSet', required: true },
    language: { $ref: '/SettingOption', required: true },
    wallpaper: { $ref: '/SettingOption', required: true },
    frame: { $ref: '/SettingOption', required: true },
    theme: { $ref: '/SettingOption', required: true },
    zoom: { $ref: '/SettingOption', required: true },
    streamerMode: { type: 'boolean', required: true },
    ringtone: { $ref: '/SettingOption', required: true },
    ringtoneVol: { type: 'number', required: true },
    notiSound: { $ref: '/SettingOption', required: true },
    notiSoundVol: { type: 'number', required: true },
    TWITTER_notiFilter: { $ref: '/SettingOption', required: true },
    TWITTER_notiSound: { $ref: '/SettingOption', required: true },
    TWITTER_notiSoundVol: { type: 'number', required: true },
    TWITTER_notifyNewFeedTweet: { type: 'boolean', required: true },
  },
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

const localStorageEffect =
  (key): AtomEffect<IPhoneSettings> =>
  ({ setSelf, onSet }) => {
    const savedVal = localStorage.getItem(key);

    if (!savedVal) setSelf(new DefaultValue());

    try {
      const validString = isSchemaValid(savedVal);
      const settingsObj = !validString ? config.defaultSettings : JSON.parse(savedVal);

      if (!validString) {
        console.error('Settings Schema was invalid, applying default settings');
        localStorage.setItem(key, JSON.stringify(config.defaultSettings));
      }

      // Triggered on init
      fetchNui(SettingEvents.NUI_SETTINGS_UPDATED, settingsObj, {}).catch();
      setSelf(settingsObj);
    } catch (e) {
      // If we are unable to parse the json string, we set default settings
      setSelf(config.defaultSettings);
    }

    onSet((newValue) => {
      // Triggered on set event
      fetchNui(SettingEvents.NUI_SETTINGS_UPDATED, newValue, {}).catch();
      if (newValue instanceof DefaultValue) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, JSON.stringify(newValue));
      }
    });
  };

export const settingsState = atom<IPhoneSettings>({
  key: 'settings',
  default: config.defaultSettings,
  effects_UNSTABLE: [localStorageEffect(NPWD_STORAGE_KEY)],
});
