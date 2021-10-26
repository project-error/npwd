import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';
import './main.css';
import PhoneConfig from './config/default.json';
import { PhoneProviders } from './PhoneProviders';
import attachMockNuiEvent from './os/debug/AttachMockNuiEvent';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import updateLocale from 'dayjs/plugin/updateLocale';
import { Theme as MaterialUITheme } from '@mui/material';

dayjs.extend(relativeTime);
dayjs.extend(updateLocale);

// Enable Sentry when config setting is true and when in prod
if (PhoneConfig.SentryErrorMetrics && process.env.NODE_ENV !== 'development') {
  Sentry.init({
    dsn: 'https://0c8321c22b794dc7a648a571cc8c3c34@sentry.projecterror.dev/2',
    autoSessionTracking: true,
    release: process.env.REACT_APP_VERSION ?? 'unknown',
    integrations: [new Integrations.BrowserTracing()],
    // We recommend adjusting this value in production, or using tracesSampler
    // for finer control
    tracesSampleRate: 1.0,
  });
}

declare module '@emotion/react' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface Theme extends MaterialUITheme {}
}

// window.mockNuiEvent is restricted to development env only
if (process.env.NODE_ENV === 'development') attachMockNuiEvent();

ReactDOM.render(
  <HashRouter>
    <RecoilRoot>
      <PhoneProviders />
    </RecoilRoot>
  </HashRouter>,
  document.getElementById('root'),
);
