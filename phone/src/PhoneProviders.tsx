import { useState } from 'react';
import { ThemeProvider, Theme, StyledEngineProvider } from '@mui/material';
import { NotificationsProvider } from '@os/notifications/providers/NotificationsProvider';
import { usePhoneTheme } from '@os/phone/hooks/usePhoneTheme';
import SnackbarProvider from './os/snackbar/providers/SnackbarProvider';
import Phone from './Phone';
import { SnackbarProvider as NotistackProvider } from 'notistack';
import { makeStyles } from '@mui/styles';
import NotificationBase from '@os/new-notifications/components/NotificationBase';
import { IApp } from '@os/apps/config/apps';

declare module '@mui/styles/defaultTheme' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}
declare module 'notistack' {
  interface VariantOverrides {
    npwdNotification: {
      app: IApp;
      path?: string;
      onClick?: () => void;
      secondaryTitle?: string;
    };
  }
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
            Components={{
              npwdNotification: NotificationBase,
            }}
            disableWindowBlurListener={true}
            anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
            domRoot={notiEl}
          >
            <SnackbarProvider>
              <Phone notiRefCB={setNotiEl} />
            </SnackbarProvider>
          </NotistackProvider>
        </NotificationsProvider>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};
