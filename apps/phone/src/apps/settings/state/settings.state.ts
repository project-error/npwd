import { atom } from 'jotai';
import { IPhoneSettings, SettingEvents } from '@typings/settings';
import config from '../../../config/default.json';
import fetchNui from '@utils/fetchNui';
import { isSchemaValid } from '../utils/schema';
import { NPWD_STORAGE_KEY } from '../utils/constants';
import { getDefaultLanguage } from '@utils/language';

const getDefaultPhoneSettings = async () => {
  return { ...config.defaultSettings, language: await getDefaultLanguage() };
};

const normalizeSettings = (settings: IPhoneSettings, defaultConfig: IPhoneSettings): IPhoneSettings => ({
  ...settings,
  theme: defaultConfig.theme,
});

const getInitialSettings = async (): Promise<IPhoneSettings> => {
  const key = NPWD_STORAGE_KEY;
  const savedVal = localStorage.getItem(key);

  const defaultConfig = await getDefaultPhoneSettings();

  if (!savedVal) return defaultConfig;

  try {
    const validString = isSchemaValid(savedVal);
    const settings: IPhoneSettings = validString
      ? normalizeSettings(JSON.parse(savedVal), defaultConfig)
      : defaultConfig;

    if (!validString) {
      console.error('Settings Schema was invalid, applying default settings');
    }

    fetchNui(SettingEvents.NUI_SETTINGS_UPDATED, settings, {}).catch();
    return settings;
  } catch (e) {
    return defaultConfig;
  }
};

const baseSettingsAtom = atom<Promise<IPhoneSettings> | IPhoneSettings>(getInitialSettings());

export const settingsState = atom(
  (get) => get(baseSettingsAtom),
  (_get, set, newValue: IPhoneSettings) => {
    fetchNui(SettingEvents.NUI_SETTINGS_UPDATED, newValue, {}).catch();
    localStorage.setItem(NPWD_STORAGE_KEY, JSON.stringify(newValue));
    set(baseSettingsAtom, newValue);
  },
);

export const resetSettingsAtom = atom(null, async (_get, set) => {
  localStorage.removeItem(NPWD_STORAGE_KEY);
  const defaultSettings = await getDefaultPhoneSettings();
  fetchNui(SettingEvents.NUI_SETTINGS_UPDATED, defaultSettings, {}).catch();
  set(baseSettingsAtom, defaultSettings);
});
