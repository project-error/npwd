import { OnMessageExportCtx } from '../../../../typings/messages';
import MessagesService from '../messages.service';

const exp = global.exports;

export const OnMessageExportMap = new Map();

exp('onMessage', (phoneNumber: string, cb: (messageCtx: OnMessageExportCtx) => void) => {
  OnMessageExportMap.set(phoneNumber, cb);
});

export const onMessageRespond = async (ctx: OnMessageExportCtx, message: string) => {
  const responseData = {
    source: ctx.req.source,
    data: {
      message,
      conversation_id: ctx.req.data.conversationId,
      author: ctx.req.data.tgtPhoneNumber,
      embed: false,
      is_embed: false,
    },
  };

  await MessagesService.handleOnMessageSendResponse(responseData);
};
