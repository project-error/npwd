import { atom, AtomEffect, DefaultValue } from 'recoil';
import { IPhoneSettings, SettingEvents } from '@typings/settings';
import config from '../../../config/default.json';
import fetchNui from '@utils/fetchNui';
import { isSchemaValid } from '../utils/schema';
import { NPWD_MULTI_STORAGE_KEY, NPWD_STORAGE_KEY } from '../utils/constants';
import { getDefaultLanguage } from '@utils/language';
import { phoneState } from '@os/phone/hooks/state';

const getDefaultPhoneSettings = async () => {
  return { ...config.defaultSettings, language: await getDefaultLanguage() };
};

const localStorageEffect: AtomEffect<IPhoneSettings> = ({ setSelf, onSet }) => {
  const key = NPWD_STORAGE_KEY;
  const savedVal = localStorage.getItem(key);

  if (!savedVal) setSelf(new DefaultValue());

  const getConfig = async (): Promise<IPhoneSettings> => {
    const defaultConfig = await getDefaultPhoneSettings();

    try {
      const validString = isSchemaValid(savedVal);
      const settings: IPhoneSettings = validString ? JSON.parse(savedVal) : defaultConfig;

      if (!validString) {
        console.error('Settings Schema was invalid, applying default settings');
      }

      // Triggered on init
      fetchNui(SettingEvents.NUI_SETTINGS_UPDATED, settings, {}).catch();
      return settings;
    } catch (e) {
      return defaultConfig;
    }
  };

  setSelf(getConfig());

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

const multiLocalStorageEffect = ({ onSet, setSelf, getLoadable }) => {
  console.log('multi storage effect');
  const key = NPWD_MULTI_STORAGE_KEY;
  const savedMultiVal = localStorage.getItem(key);
  const { state, contents: identifier } = getLoadable(phoneState.playerIdentifier);
  if (state !== 'hasValue') return console.log('Could not find identifier1');

  const parsedSavedMultiVal = JSON.parse(savedMultiVal);

  if (!parsedSavedMultiVal) setSelf(new DefaultValue());

  const getConfig = async (): Promise<IPhoneSettings> => {
    const defaultConfig = await getDefaultPhoneSettings();

    try {
      const settings: IPhoneSettings = JSON.parse(savedMultiVal[identifier]) ?? defaultConfig;

      // Triggered on init
      fetchNui(SettingEvents.NUI_SETTINGS_UPDATED, settings, {}).catch();
      return settings;
    } catch (e) {
      return defaultConfig;
    }
  };

  setSelf(getConfig());

  onSet((newValue) => {
    console.log('new value multi', newValue);
    if (newValue instanceof DefaultValue) {
      localStorage.removeItem(key);
    } else {
      const savedMultiVal = localStorage.getItem(key);
      let parsedSavedMultiVal = JSON.parse(savedMultiVal);

      if (!parsedSavedMultiVal) {
        parsedSavedMultiVal = {};
      }
      parsedSavedMultiVal[identifier] = newValue;

      localStorage.setItem(key, JSON.stringify(parsedSavedMultiVal));
    }
  });
};

export const settingsState = atom<IPhoneSettings>({
  key: 'settings',
  default: getDefaultPhoneSettings(),
  effects: [localStorageEffect],
});

export const multiSettingsState = atom<IPhoneSettings>({
  key: 'multisettings',
  default: getDefaultPhoneSettings(),
  effects: [multiLocalStorageEffect],
});
