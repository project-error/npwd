import React from 'react';
import { ThemeProvider, Theme, StyledEngineProvider } from '@mui/material';
import { NotificationsProvider } from '@os/notifications/providers/NotificationsProvider';
import { usePhoneTheme } from '@os/phone/hooks/usePhoneTheme';
import SnackbarProvider from './os/snackbar/providers/SnackbarProvider';
import Phone from './Phone';
import { NuiProvider } from 'fivem-nui-react-lib';
import { SoundProvider } from '@os/sound/providers/SoundProvider';

declare module '@mui/styles/defaultTheme' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}

export const PhoneProviders = () => {
  const currentTheme = usePhoneTheme();
  return (
    <NuiProvider resource="npwd">
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={currentTheme}>
          <SoundProvider>
            <NotificationsProvider>
              <SnackbarProvider>
                <Phone />
              </SnackbarProvider>
            </NotificationsProvider>
          </SoundProvider>
        </ThemeProvider>
      </StyledEngineProvider>
    </NuiProvider>
  );
};
