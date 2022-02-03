import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locale/en.json';
import es from './locale/es.json';
import de from './locale/de.json';
import fr from './locale/fr.json';
import ba from './locale/ba.json';
import sv from './locale/sv.json';
import no from './locale/no.json';
import tr from './locale/tr.json';
import ptbr from './locale/ptbr.json';
import hu from './locale/hu.json';
import cs from './locale/cs.json';
import pt from './locale/pt.json';
import pl from './locale/pl.json';
import nl from './locale/nl.json';
import fi from './locale/fi.json';
import it from './locale/it.json';
import id from './locale/id.json';
import zhtw from './locale/zhtw.json';

// Should we just programatically call for static files
// on the scripts side to avoid having to parse all these
// JSONs for no reason? yes, probably
export const resources = {
  en,
  es,
  fr,
  ba,
  no,
  sv,
  de,
  tr,
  ptbr,
  pt,
  pl,
  hu,
  cs,
  nl,
  fi,
  it,
  id,
  zhtw,
} as const;

const missingKeyHandler = (
  lng: Readonly<string[]>,
  s: string,
  key: string,
  fallbackValue: string,
) => {
  if (process.env.NODE_ENV !== 'development') return;
  console.error(
    `!! TRANSLATION KEY NOT FOUND FOR LANGAUGE "${lng}", KEY "${key}". RENDERED ${fallbackValue} INSTEAD"" !!`,
  );
};

i18n.use(initReactI18next).init({
  lng: 'en',
  // initImmediate: true,
  saveMissing: true,
  missingKeyHandler,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false, // not needed for react as it escapes by default
  },
  resources,
});

export default i18n;
