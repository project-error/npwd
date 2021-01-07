import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locale/en.json';
import es from './locale/es.json';
import fr from './locale/fr.json';
import bh from './locale/bh.json';
import sv from './locale/sv.json';
import tr from './locale/tr.json';
import config from './config/default.json';

const resources = {
  en,
  es,
  fr,
  bh,
  sv,
  tr,
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: config.language,

    keySeparator: false, // we do not use keys in form messages.welcome

    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
