import React, { useState } from 'react';
import { ThemeProvider, Theme, StyledEngineProvider } from '@mui/material';
import { NotificationsProvider } from '@os/notifications/providers/NotificationsProvider';
import { usePhoneTheme } from '@os/phone/hooks/usePhoneTheme';
import SnackbarProvider from './os/snackbar/providers/SnackbarProvider';
import Phone from './Phone';
import { useNuiEvent } from 'fivem-nui-react-lib';
import { SoundProvider } from '@os/sound/providers/SoundProvider';
import { RecoilRoot } from 'recoil';
import { PhoneEvents } from '@typings/phone';

declare module '@mui/styles/defaultTheme' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}

export const PhoneProviders = () => {
  const currentTheme = usePhoneTheme();

  // Because how both recoil functions and how our store works, we need
  // to use *somewhat* of a hack for resetting the global state. In this case,
  // we just increment a counter every time we change characters in order to force
  // a refresh
  // This is liable to memory leaky behavior in extreme cases.
  const [curChar, setCurChar] = useState(0);

  useNuiEvent('PHONE', PhoneEvents.UNLOAD_CHARACTER, () => {
    setCurChar(curChar + 1);
  });

  return (
    <RecoilRoot key={curChar}>
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
    </RecoilRoot>
  );
};
