import React, { useState } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { Provider as JotaiProvider } from 'jotai';
import { useNuiEvent } from 'fivem-nui-react-lib';
import { PhoneEvents } from '@typings/phone';
import { queryClient } from './query-client';

interface AppStateProvidersProps {
  children: React.ReactNode;
}

export const AppStateProviders = ({ children }: AppStateProvidersProps) => {
  const [stateKey, setStateKey] = useState(0);

  useNuiEvent('PHONE', PhoneEvents.UNLOAD_CHARACTER, () => {
    queryClient.clear();
    setStateKey((current) => current + 1);
  });

  return (
    <QueryClientProvider client={queryClient}>
      <JotaiProvider key={stateKey}>{children}</JotaiProvider>
    </QueryClientProvider>
  );
};
