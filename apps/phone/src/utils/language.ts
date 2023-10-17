import phoneConfig from '../config/default.json';
import { fetchConfig } from './config';
import { isEnvBrowser } from './misc';

export const getDefaultLanguage = async () => {
  if (isEnvBrowser()) return phoneConfig.defaultSettings.language;

  const mainConfig = await fetchConfig();
  const defaultLanguage = phoneConfig?.languages?.find(
    (language) => language.value === mainConfig?.general.defaultLanguage,
  );

  return defaultLanguage;
};
