import React from 'react';
import { AppWrapper } from '@ui/components';
import { AppContent } from '@ui/components/AppContent';
import { useApp } from '@os/apps/hooks/useApps';
import { BankingThemeProvider } from '../providers/BankingThemeProvider';
import { AppTitle } from '@ui/components/AppTitle';
import { BankingApp } from './BankingApp';

// AppContent by default has a React.Suspense which can be used to handle the app as a whole, for
// when it must resolve the render promise. But, we must make sure that this is is mounted in a component
// higher in the tree than the Recoil state caller.

// This is why this wrapper component is needed.
export const BankingAppWrapper: React.FC = () => {
  const example = useApp('BANKING');
  return (
    <BankingThemeProvider>
      <AppWrapper>
        <AppTitle app={example} />
        <AppContent>
          <BankingApp />
        </AppContent>
      </AppWrapper>
    </BankingThemeProvider>
  );
};
