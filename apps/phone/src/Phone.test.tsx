import React from 'react';
import { PhoneProviders } from './phone-providers';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { NuiProvider } from 'fivem-nui-react-lib';
import { AppStateProviders } from '@common/query/app-state-providers';

jest.useFakeTimers();

const NuiProviderComponent = NuiProvider as React.ComponentType<{
  children: React.ReactNode;
  resource: string;
  timeout?: number | false;
}>;

test('renders Phone', () => {
  jest.mock('@utils/fetchNui');

  render(
    <MemoryRouter>
      <NuiProviderComponent resource="npwd">
        <React.Suspense fallback={null}>
          <AppStateProviders>
            <PhoneProviders />
          </AppStateProviders>
        </React.Suspense>
      </NuiProviderComponent>
    </MemoryRouter>,
  );
});
