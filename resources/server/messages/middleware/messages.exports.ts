import { MessageExportCtx, PreDBMessage } from '../../../../typings/messages';

global.exports(
  'useOnMessageHandler',
  (phoneNumber: string, cb: (messageExportCtx: MessageExportCtx) => void) => {
    on(
      'messages:onMessage',
      (
        messageData: PreDBMessage,
        resolve: (value: unknown) => void,
        reject: (reason: string) => void,
      ) => {
        if (phoneNumber !== messageData.tgtPhoneNumber) return;

        const next = () => {
          resolve('Going to the next handler');
        };

        const exit = () => {
          reject('Exiting all NPWD handlers');
        };

        cb({
          messageObject: messageData,
          next,
          exit,
        });
      },
    );
  },
);

export function onMessage(ctx: PreDBMessage) {
  return new Promise((resolve, reject) => {
    emit('messages:onMessage', ctx, resolve, reject);
  });
}
