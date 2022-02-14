import { EmitMessageExportCtx } from '../../../../typings/messages';
import MessagesService from '../messages.service';

const exp = global.exports;

// I am so tired when I am writing this
exp('emitMessage', async ({ senderNumber, targetNumber, message }: EmitMessageExportCtx) => {
  await MessagesService.handleEmitMessage({ senderNumber, targetNumber, message });
});
