import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';
import './main.css';
import { PhoneProviders } from './PhoneProviders';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import updateLocale from 'dayjs/plugin/updateLocale';
import { Theme as MaterialUITheme } from '@mui/material';
import { RewriteFrames } from '@sentry/integrations';
import attachWindowDebug from './os/debug/AttachWindowDebug';
import { NuiProvider } from 'fivem-nui-react-lib';
import { RecoilRootManager } from './lib/RecoilRootManager';
import { RecoilDebugObserver } from './lib/RecoilDebugObserver';
import './i18n';
import { RecoilEnv } from 'recoil';

RecoilEnv.RECOIL_DUPLICATE_ATOM_KEY_CHECKING_ENABLED = false;

dayjs.extend(relativeTime);
dayjs.extend(updateLocale);

declare module '@emotion/react' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface Theme extends MaterialUITheme {}
}

// window.mockNuiEvent is restricted to development env only
if (process.env.NODE_ENV === 'development') {
  attachWindowDebug();
}

ReactDOM.render(
  <HashRouter>
    <NuiProvider resource="npwd">
      <React.Suspense fallback={null}>
        <RecoilRootManager>
          <RecoilDebugObserver>
            <PhoneProviders />
          </RecoilDebugObserver>
        </RecoilRootManager>
      </React.Suspense>
    </NuiProvider>
  </HashRouter>,
  document.getElementById('root'),
);
