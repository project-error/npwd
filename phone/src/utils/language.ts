import phoneConfig from '../config/default.json';
import { fetchConfig } from './config';

export const getDefaultLanguage = async () => {
  const mainConfig = await fetchConfig();
  const defaultLanguage = phoneConfig?.languages?.find(
    (language) => language.value === mainConfig?.general.defaultLanguage,
  );

  return defaultLanguage ?? phoneConfig.defaultSettings.language;
};
