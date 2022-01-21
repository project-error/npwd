import { OnMessageExportCtx, PreDBMessage } from '../../../../typings/messages';
import { PromiseRequest } from '../../lib/PromiseNetEvents/promise.types';
import MessagesService from '../messages.service';

const exp = global.exports;

export const OnMessageExportMap = new Map();

exp('onMessage', (phoneNumber: string, cb: (messageCtx: OnMessageExportCtx) => void) => {
  console.log('Registered onMessage with number:', phoneNumber);

  OnMessageExportMap.set(phoneNumber, cb);
});

export const onMessageNext = () => {
  console.log('Going to the next handler');
};

export const onMessageRespond = async (ctx: OnMessageExportCtx, message: string) => {
  const responseData: PromiseRequest<PreDBMessage> = {
    source: ctx.req.source,
    data: {
      message,
      conversationId: ctx.req.data.conversationId,
      tgtPhoneNumber: ctx.req.data.tgtPhoneNumber,
    },
  };

  await MessagesService.handleOnMessageSendResponse(responseData);
};
