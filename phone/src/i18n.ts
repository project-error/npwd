import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locale/en.json';
import es from './locale/es.json';
import fr from './locale/fr.json';
import bs from './locale/bs.json';
import sv from './locale/sv.json';
import no from './locale/no.json';
import tr from './locale/tr.json';
import ptbr from './locale/ptbr.json';
import pt from './locale/pt.json';
import config from './config/default.json';

const resources = {
  en,
  es,
  fr,
  bs,
  no,
  sv,
  tr,
  ptbr,
  pt,
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
