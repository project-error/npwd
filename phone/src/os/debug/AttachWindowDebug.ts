import { PhoneEvents } from '../../../../typings/phone';

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
