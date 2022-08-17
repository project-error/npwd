import React, { useState } from 'react';
import { ThemeProvider, Theme, StyledEngineProvider } from '@mui/material';
import { NotificationsProvider } from '@os/notifications/providers/NotificationsProvider';
import { NotificationProvider as NewNotisProvider } from '@os/new-notifications/NotificationProvider';
import { usePhoneTheme } from '@os/phone/hooks/usePhoneTheme';
import SnackbarProvider from './os/snackbar/providers/SnackbarProvider';
import Phone from './Phone';
import { SnackbarProvider as NotistackProvider } from 'notistack';
import { makeStyles } from '@mui/styles';

declare module '@mui/styles/defaultTheme' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}

const useStyles = makeStyles({
  rootOverride: {
    '&.SnackbarContainer-center': {
      position: 'absolute !important',
      top: 'unset !important',
      maxWidth: '370px !important',
    },
    '&.CollapseWrapper': {
      padding: '0 !important',
      backdropFilter: 'blur(4px) !important',
    },
  },
});

export const PhoneProviders = () => {
  const currentTheme = usePhoneTheme();
  const [notiEl, setNotiEl] = useState<HTMLElement>();
  const classes = useStyles();

  console.log('notis el', notiEl);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={currentTheme}>
        <NotificationsProvider>
          <NotistackProvider
            classes={{
              containerRoot: classes.rootOverride,
            }}
            autoHideDuration={3000}
            maxSnack={2}
            disableWindowBlurListener={true}
            anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
            domRoot={notiEl}
          >
            <NewNotisProvider>
              <SnackbarProvider>
                <Phone notiRefCB={setNotiEl} />
              </SnackbarProvider>
            </NewNotisProvider>
          </NotistackProvider>
        </NotificationsProvider>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};
