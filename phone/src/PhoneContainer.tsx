import React from 'react';
import { ThemeProvider } from '@material-ui/core';
import { NotificationsProvider } from './os/notifications/providers/NotificationsProvider';
import { usePhoneTheme } from './os/phone/hooks/usePhoneTheme';
import SnackbarProvider from './ui/providers/SnackbarProvider';
import Phone from './Phone';
import { SoundProvider } from './os/sound/providers/SoundProvider';

export const PhoneContainer = () => {
  const currentTheme = usePhoneTheme();
  return (
    <ThemeProvider theme={currentTheme}>
      <SoundProvider>
        <NotificationsProvider>
          <SnackbarProvider>
            <Phone />
          </SnackbarProvider>
        </NotificationsProvider>
      </SoundProvider>
    </ThemeProvider>
  );
};
