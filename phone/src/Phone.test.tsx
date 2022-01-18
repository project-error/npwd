import React from 'react';
import { PhoneProviders } from './PhoneProviders';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { NuiProvider } from 'fivem-nui-react-lib';
import { RecoilRootManager } from './lib/RecoilRootManager';
import { RecoilDebugObserver } from './lib/RecoilDebugObserver';

jest.useFakeTimers();

it('renders Phone', () => {
  render(
    <MemoryRouter>
      <NuiProvider resource="npwd">
        <React.Suspense fallback={null}>
          <RecoilRootManager>
            <RecoilDebugObserver>
              <PhoneProviders />
            </RecoilDebugObserver>
          </RecoilRootManager>
        </React.Suspense>
      </NuiProvider>
    </MemoryRouter>,
  );
});
