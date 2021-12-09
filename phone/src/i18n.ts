import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locale/en.json';
import es from './locale/es.json';
import fr from './locale/fr.json';
import ba from './locale/ba.json';
import sv from './locale/sv.json';
import no from './locale/no.json';
import tr from './locale/tr.json';
import ptbr from './locale/ptbr.json';
import hu from './locale/hu.json';
import cs from './locale/cs.json';
import pt from './locale/pt.json';
import nl from './locale/nl.json';

export const defaultNS = 'ns1';

export const resources = {
  en,
  es,
  fr,
  ba,
  no,
  sv,
  tr,
  ptbr,
  pt,
  hu,
  cs,
  nl,
} as const;

i18n.use(initReactI18next).init({
  lng: 'en',
  interpolation: {
    escapeValue: false, // not needed for react as it escapes by default
  },
  resources,
});

export default i18n;
