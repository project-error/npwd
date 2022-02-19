import { PhoneEvents } from '@typings/phone';
import { IAlert } from '@os/snackbar/hooks/useSnackbar';
import { NotificationEvents, QueueNotificationOptsReadonly } from '@typings/notifications';
import { ActiveCall, CallEvents } from '@typings/call';

function dispatchEvent<T = any>({ method, app, data }: { method: string; app: string; data: T }) {
  setTimeout(() => {
    window.dispatchEvent(
      new MessageEvent('message', {
        data: {
          app,
          method,
          data: data ?? {},
        },
      }),
    );
  }, 200);
}

const debugObj = {
  testNotification: (duration = 3000) => {
    dispatchEvent<QueueNotificationOptsReadonly>({
      method: NotificationEvents.QUEUE_NOTIFICATION,
      app: 'PHONE',
      data: {
        uniqId: Date.now().toString(),
        appId: 'TWITTER',
        path: '/twitter',
        message: 'Taso just tweeted: You suck bro!',
        duration: duration,
      },
    });
  },
  closeNotification: (id: string) => {
    dispatchEvent({
      method: NotificationEvents.SET_NOTIFICATION_INACTIVE,
      app: 'PHONE',
      data: id,
    });
  },
  clearAllNotifications: () => {
    dispatchEvent({
      method: NotificationEvents.CLEAR_NOTIFICATIONS,
      data: {},
      app: 'PHONE',
    });
  },
  testCallOutgoing: () => {
    dispatchEvent({ app: 'CALL', method: CallEvents.SET_CALL_MODAL, data: true });
    dispatchEvent<ActiveCall>({
      method: CallEvents.SET_CALL_INFO,
      app: 'CALL',
      data: {
        is_accepted: false,
        isTransmitter: true,
        receiver: '+84909090909',
        transmitter: '+84909090909',
      },
    });
  },
  endCallOutgoing: () => {
    dispatchEvent({ app: 'CALL', method: CallEvents.SET_CALL_INFO, data: null });
    dispatchEvent({ app: 'CALL', method: CallEvents.SET_CALL_MODAL, data: false });
  },
  mockNuiEvent: dispatchEvent,
  testSnackbar: (message: string, type: IAlert) => {
    dispatchEvent({
      app: 'PHONE',
      data: {
        message,
        type,
      },
      method: PhoneEvents.ADD_SNACKBAR_ALERT,
    });
  },
  setPhoneVisible: (bool: boolean) => {
    dispatchEvent({
      method: PhoneEvents.SET_VISIBILITY,
      data: bool,
      app: 'PHONE',
    });
  },
};

const attachWindowDebug = () => {
  (window as any).npwdDebug = debugObj;
};

export default attachWindowDebug;
