import React, { useState } from 'react';
import { ThemeProvider, Theme, StyledEngineProvider, Collapse } from '@mui/material';
import { NotificationsProvider as OldNotificationProvider } from './os/notifications/providers/NotificationsProvider';
import { usePhoneTheme } from '@os/phone/hooks/usePhoneTheme';
import { SnackbarProvider as NotistackProvider } from 'notistack';
import Phone from './Phone';
import { SoundProvider } from '@os/sound/providers/SoundProvider';
import { NuiProvider } from 'fivem-nui-react-lib';
import { SoundProvider } from '@os/sound/providers/SoundProvider';
import { makeStyles } from '@mui/styles';
import SnackbarProvider from '@os/snackbar/providers/SnackbarProvider';

declare module '@mui/styles/defaultTheme' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}

const useStyles = makeStyles({
  rootOverride: {
    '&.SnackbarContainer-top': {
      top: 'unset !important',
      maxWidth: '75%',
    },
  },
});

export const PhoneProviders = () => {
  const currentTheme = usePhoneTheme();
  const [notiEl, setNotiEl] = useState<HTMLElement>();
  const classes = useStyles();

  return (
    <NuiProvider resource="npwd">
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={currentTheme}>
          <SoundProvider>
            <OldNotificationProvider>
              <NotistackProvider
                maxSnack={2}
                domRoot={notiEl}
                TransitionComponent={Collapse}
                classes={{
                  containerRoot: classes.rootOverride,
                }}
              >
                <SnackbarProvider>
                  <Phone notiRefCB={setNotiEl} />
                </SnackbarProvider>
              </NotistackProvider>
            </OldNotificationProvider>
          </SoundProvider>
        </ThemeProvider>
      </StyledEngineProvider>
    </NuiProvider>
  );
};
