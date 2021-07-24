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

dayjs.extend(relativeTime);
dayjs.extend(updateLocale);

// Enable Sentry when config setting is true and when in prod
if (PhoneConfig.SentryErrorMetrics && process.env.NODE_ENV !== 'development') {
  Sentry.init({
    dsn: 'https://71fff4e8f11543fa8dbe7acd0f94fb5d@o478949.ingest.sentry.io/5581619',
    autoSessionTracking: true,
    integrations: [new Integrations.BrowserTracing()],
    // We recommend adjusting this value in production, or using tracesSampler
    // for finer control
    tracesSampleRate: 1.0,
  });
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
