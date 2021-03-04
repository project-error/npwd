function dispatchEvent({ method, app, data }: { method: string; app: string; data: unknown }) {
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
/**
 * Allows you to mock NUI data from your console by attaching
 * to the global window object
 * @example
 * mockNuiEvent({
 *   app: 'NOTES',
 *   method: 'setAlert',
 *   data: {
 *     message: 'CONTACT_ADD_SUCCESS',
 *     type: 'success',
 *   }
 * })
 **/
const attachMockNuiEvent = () => {
  //@ts-ignore
  window.mockNuiEvent = dispatchEvent;
};

export default attachMockNuiEvent;
