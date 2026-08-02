import React from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router';
import './main.css';
import { applyDarkMode } from '@common/hooks/use-color-scheme';
import { PhoneProviders } from './phone-providers';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import updateLocale from 'dayjs/plugin/updateLocale';
import attachWindowDebug from './os/debug/AttachWindowDebug';
import { NuiProvider } from 'fivem-nui-react-lib';
import './i18n';
import { AppStateProviders } from '@common/query/app-state-providers';

const NuiProviderComponent = NuiProvider as React.ComponentType<{
  children: React.ReactNode;
  resource: string;
  timeout?: number | false;
}>;

dayjs.extend(relativeTime);
dayjs.extend(updateLocale);

// window.mockNuiEvent is restricted to development env only
if (import.meta.env.DEV) {
  attachWindowDebug();
}

applyDarkMode();

createRoot(document.getElementById('root') as HTMLElement).render(
  <HashRouter>
    <NuiProviderComponent resource="npwd">
      <React.Suspense fallback={null}>
        <AppStateProviders>
          <PhoneProviders />
        </AppStateProviders>
      </React.Suspense>
    </NuiProviderComponent>
  </HashRouter>,
);
