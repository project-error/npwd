import mainConfig from '../../../config.json';
import config from '../config/default.json';

export const getDefaultLanguage = () => {
  const defaultLanguage = config?.languages?.find(
    (language) => language.value === mainConfig?.general?.defaultLanguage,
  );

  return defaultLanguage ?? config.defaultSettings.language;
};
