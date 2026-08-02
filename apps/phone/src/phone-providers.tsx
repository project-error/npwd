import { useState } from 'react';

import { NotificationsProvider } from '@os/notifications/providers/NotificationsProvider';
import SnackbarProvider from './os/snackbar/providers/SnackbarProvider';
import Phone from './phone';
import { SnackbarProvider as NotistackProvider } from 'notistack';
import NotificationBase from '@os/new-notifications/components/NotificationBase';
import { IApp } from '@os/apps/config/apps';
import { CallNotificationBase } from '@os/new-notifications/components/calls/CallNotificationBase';
import { SystemNotificationBase } from '@os/new-notifications/components/system/SystemNotificationBase';

declare module 'notistack' {
  interface VariantOverrides {
    npwdNotification: {
      app: IApp;
      path?: string;
      onClick?: () => void;
      secondaryTitle?: string;
    };
    npwdCallNotification: {
      title: string;
      transmitter: string;
      receiver: string;
    };
    npwdSystemNotification: {
      secondaryTitle?: string;
      controls: boolean;
    };
  }
}

export const PhoneProviders = () => {
  const [notiEl, setNotiEl] = useState<HTMLElement>();

  return (
    <NotificationsProvider>
      <NotistackProvider
        autoHideDuration={3000}
        maxSnack={2}
        Components={{
          npwdNotification: NotificationBase,
          npwdCallNotification: CallNotificationBase,
          npwdSystemNotification: SystemNotificationBase,
        }}
        disableWindowBlurListener={true}
        anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
        domRoot={notiEl}
        classes={{
          containerRoot: 'SnackbarContainer-center !absolute !max-w-[370px]',
          collapseWrapper: '!p-0',
        }}
      >
        <SnackbarProvider>
          <Phone notiRefCB={setNotiEl} />
        </SnackbarProvider>
      </NotistackProvider>
    </NotificationsProvider>
  );
};
