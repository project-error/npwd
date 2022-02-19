import React from 'react';
import { ThemeProvider, Theme, StyledEngineProvider } from '@mui/material';
import { NotificationsProvider } from '@os/notifications/providers/NotificationsProvider';
import { usePhoneTheme } from '@os/phone/hooks/usePhoneTheme';
import SnackbarProvider from './os/snackbar/providers/SnackbarProvider';
import Phone from './Phone';
import { SoundProvider } from '@os/sound/providers/SoundProvider';
import { WordFilterProvider } from './os/wordfilter/providers/WordFilterProvider';

declare module '@mui/styles/defaultTheme' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}

export const PhoneProviders = () => {
  const currentTheme = usePhoneTheme();

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={currentTheme}>
        <SoundProvider>
          <NotificationsProvider>
            <SnackbarProvider>
              <WordFilterProvider>
                <Phone />
              </WordFilterProvider>
            </SnackbarProvider>
          </NotificationsProvider>
        </SoundProvider>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};
