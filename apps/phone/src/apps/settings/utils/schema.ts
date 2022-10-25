import { Schema, Validator } from 'jsonschema';
import { NPWD_STORAGE_KEY } from './constants';

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
    notiSound: { $ref: '/SettingOption', required: true },
    TWITTER_notiFilter: { $ref: '/SettingOption', required: true },
    TWITTER_notiSound: { $ref: '/SettingOption', required: true },
    TWITTER_notiSoundVol: { type: 'number', required: true },
    TWITTER_notifyNewFeedTweet: { type: 'boolean', required: true },
    MARKETPLACE_notifyNewListing: { type: 'boolean', required: true },
  },
};

v.addSchema(settingOptionSchema, '/SettingOption');

export function isSchemaValid(schema: string): boolean {
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
      console.error(
        'JSON eror encountered while parsing the NPWD localStorage JSON string, using default schema as a fall back.',
        e,
      );
    }
  }
  return true;
}
