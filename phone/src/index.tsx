import '@babel/polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';
import './main.css';
import PhoneConfig from './config/default.json';
import { PhoneContainer } from './PhoneContainer';

// Enable Sentry when config setting is true
if (PhoneConfig.SentryErrorMetrics) {
  Sentry.init({
    dsn:
      'https://71fff4e8f11543fa8dbe7acd0f94fb5d@o478949.ingest.sentry.io/5581619',
    autoSessionTracking: true,
    integrations: [new Integrations.BrowserTracing()],
    // We recommend adjusting this value in production, or using tracesSampler
    // for finer control
    tracesSampleRate: 1.0,
  });
}

ReactDOM.render(
  <HashRouter>
    <RecoilRoot>
      <PhoneContainer />
    </RecoilRoot>
  </HashRouter>,
  document.getElementById('root')
);
