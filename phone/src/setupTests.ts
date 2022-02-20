import '@testing-library/jest-dom';
import './i18n';

import { NPWD_STORAGE_KEY } from '@apps/settings/utils/constants';
import config from './config/default.json';

localStorage.setItem(
  NPWD_STORAGE_KEY,
  JSON.stringify({
    ...config.defaultSettings,
    language: {
      label: 'Swedish',
      value: 'sv',
    },
  }),
);
