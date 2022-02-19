import React, { useState } from 'react';
import { ThemeProvider, Theme, StyledEngineProvider } from '@mui/material';
import { NotificationsProvider as OldNotificationProvider } from './os/notifications/providers/NotificationsProvider';
import { usePhoneTheme } from '@os/phone/hooks/usePhoneTheme';
import { SnackbarProvider as NotistackProvider } from 'notistack';
import Phone from './Phone';
import { NuiProvider } from 'fivem-nui-react-lib';
import { SoundProvider } from '@os/sound/providers/SoundProvider';
import SnackbarProvider from '@os/snackbar/providers/SnackbarProvider';
import { NotificationBase } from '@os/new-notifications/components/NotificationBase';

declare module '@mui/styles/defaultTheme' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}

// export const SLideWrapper = forwardRef<HTMLDivElement, TransitionProps>((props, ref) => {
//   return (
//     <Slide
//       direction={props.direction}
//       onExited={(node) => props.onExited(node, props.id)}
//       exit={true}
//       mountOnEnter={props.mountOnEnter}
//       timeout={500}
//       onEnter={(node, isAppearing) => props.onEnter(node, isAppearing, props.id)}
//       onExit={(node) => props.onExit(node, props.id)}
//       onEntered={(node, isAppearing) => props.onEntered(node, isAppearing, props.id)}
//     >
//       <>{props.children}</>
//     </Slide>
//   );
// });

export const PhoneProviders = () => {
  const currentTheme = usePhoneTheme();
  const [notiEl, setNotiEl] = useState<HTMLElement>();

  return (
    <NuiProvider resource="npwd">
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={currentTheme}>
          <SoundProvider>
            <OldNotificationProvider>
              <NotistackProvider
                anchorOrigin={{
                  horizontal: 'center',
                  vertical: 'bottom',
                }}
                disableWindowBlurListener={true}
                maxSnack={2}
                Components={{
                  npwdNotification: NotificationBase,
                }}
                TransitionProps={{}}
                onExit={(node) => console.log(node)}
                domRoot={notiEl}
                autoHideDuration={3000}
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
