import React from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import './main.css';
import { PhoneProviders } from './PhoneProviders';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import updateLocale from 'dayjs/plugin/updateLocale';
import attachWindowDebug from './os/debug/AttachWindowDebug';
import { NuiProvider } from 'fivem-nui-react-lib';
import { RecoilRootManager } from './lib/RecoilRootManager';
import { RecoilDebugObserver } from './lib/RecoilDebugObserver';
import './i18n';

dayjs.extend(relativeTime);
dayjs.extend(updateLocale);

// window.mockNuiEvent is restricted to development env only
if (process.env.NODE_ENV === 'development') {
  attachWindowDebug();
}

createRoot(document.getElementById('root')!).render(
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
);
