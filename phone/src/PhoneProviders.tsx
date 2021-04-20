import React from 'react';
import { ThemeProvider } from '@material-ui/core';
import { NotificationsProvider } from './os/notifications/providers/NotificationsProvider';
import { usePhoneTheme } from './os/phone/hooks/usePhoneTheme';
import SnackbarProvider from './ui/providers/SnackbarProvider';
import Phone from './Phone';
import { NuiProvider } from 'fivem-nui-react-lib';
import { SoundProvider } from './os/sound/providers/SoundProvider';

export const PhoneProviders = () => {
  const currentTheme = usePhoneTheme();
  return (
    <NuiProvider resource="new-phone-who-dis">
      <ThemeProvider theme={currentTheme}>
        <SoundProvider>
          <NotificationsProvider>
            <SnackbarProvider>
              <Phone />
            </SnackbarProvider>
          </NotificationsProvider>
        </SoundProvider>
      </ThemeProvider>
    </NuiProvider>
  );
};
