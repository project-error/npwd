import { EmitMessageExportCtx } from '../../../../typings/messages';
import MessagesService from '../messages.service';

const exp = global.exports;

// FIXME: Fix this, oh wait, no one contributes anymore
exp('emitMessage', async ({ senderNumber, targetNumber, message, embed }: EmitMessageExportCtx) => {
  await MessagesService.handleEmitMessage({
    senderNumber,
    targetNumber,
    message,
    embed: embed && JSON.stringify(embed),
  });
});
