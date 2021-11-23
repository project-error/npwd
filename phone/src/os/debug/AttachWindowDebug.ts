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
};

const attachWindowDebug = () => {
  (window as any).npwdDebug = debugObj;
};

export default attachWindowDebug;
