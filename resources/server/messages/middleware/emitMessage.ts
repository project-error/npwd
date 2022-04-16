import { EmitMessageExportCtx } from '../../../../typings/messages';
import MessagesService from '../messages.service';

const exp = global.exports;

// FIXME: Fix this, oh wait, no one contributes anymore
exp('emitMessage', async ({ senderNumber, targetNumber, message }: EmitMessageExportCtx) => {
  await MessagesService.handleEmitMessage({ senderNumber, targetNumber, message });
});
