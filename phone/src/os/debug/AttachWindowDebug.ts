import { PhoneEvents } from '../../../../typings/phone';
import { IAlert } from '../snackbar/hooks/useSnackbar';

function dispatchEvent({ method, app, data = {} }: { method: string; app: string; data: unknown }) {
  setTimeout(() => {
    window.dispatchEvent(
      new MessageEvent('message', {
        data: {
          app,
          method,
          data,
        },
      }),
    );
  }, 200);
}

const debugObj = {
  testNotification: () => {
    dispatchEvent({ method: 'notiTest', app: 'PHONE', data: {} });
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
