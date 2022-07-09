import React from 'react';
import { AppWrapper } from '@ui/components';
import { AppContent } from '@ui/components/AppContent';
import { useApp } from '@os/apps/hooks/useApps';
import { GarageThemeProvider } from '../providers/GarageThemeProvider';
import { AppTitle } from '@ui/components/AppTitle';
import { GarageApp } from './GarageApp';

export const GarageAppWrapper: React.FC = () => {
  const garage = useApp('GARAGE');
  return (
    <GarageThemeProvider>
      <AppWrapper>
        <AppTitle app={garage} />
        <AppContent>
          <GarageApp />
        </AppContent>
      </AppWrapper>
    </GarageThemeProvider>
  );
};
