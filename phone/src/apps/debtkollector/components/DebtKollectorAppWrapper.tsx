import React from 'react';
import { AppWrapper } from '@ui/components';
import { AppContent } from '@ui/components/AppContent';
import { AppTitle } from '@ui/components/AppTitle';
import { DebtKollectorApp } from './DebtKollectorApp';
import { useApp } from '@os/apps/hooks/useApps';
import { DebtKollectorThemeProvider } from '../providers/DebtKollectorThemeProvider';

export const DebtKollectorAppWrapper: React.FC = () => {
  const debtKollector = useApp('DEBTKOLLECTOR');
  return (
    <DebtKollectorThemeProvider>
      <AppWrapper>
        <AppTitle app={debtKollector} />
        <AppContent>
          <DebtKollectorApp />
        </AppContent>
      </AppWrapper>
    </DebtKollectorThemeProvider>
  );
};
