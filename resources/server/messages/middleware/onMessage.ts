import { OnMessageExportCtx } from '../../../../typings/messages';
import MessagesService from '../messages.service';

const exp = global.exports;

export const OnMessageExportMap = new Map();

exp('onMessage', (phoneNumber: string, cb: (messageCtx: OnMessageExportCtx) => void) => {
  OnMessageExportMap.set(phoneNumber, cb);
});

export const onMessageRespond = async (ctx: OnMessageExportCtx, message: string) => {
  const responseData = {
    source: ctx.source,
    data: {
      message,
      conversation_id: ctx.data.conversationId,
      author: ctx.data.tgtPhoneNumber,
      embed: false,
      is_embed: false,
    },
  };

  await MessagesService.handleOnMessageSendResponse(responseData);
};
