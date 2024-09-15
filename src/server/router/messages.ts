import { Router } from 'fivem-router';
import z from 'zod';
import { handleError } from '../utils/errors';
import MessageService from '../services/MessageService';

export const messagesRouter = new Router({
  prefix: '/messages',
});

messagesRouter.add('/', async (ctx, next) => {
  /** Return my messages */
  try {
    const messages = await MessageService.getMessages(ctx);

    ctx.body = {
      ok: true,
      payload: messages,
    };
  } catch (error) {
    handleError(error, ctx);
  }
});

const sendMessageSchema = z.object({
  content: z.string().min(1).max(255),
  phoneNumber: z.string().min(2).max(15),
});

messagesRouter.add('/send', async (ctx, next) => {
  try {
    const { content, phoneNumber } = sendMessageSchema.parse(ctx.request.body);

    // Send message to phoneNumber
    const message = await MessageService.sendMessage(ctx, content, phoneNumber);

    ctx.body = {
      ok: true,
      payload: message,
    };
  } catch (error) {
    handleError(error, ctx);
  }

  await next();
});

messagesRouter.add('/conversation/:phoneNumber', async (ctx, next) => {
  try {
    const { phoneNumber } = z.object({ phoneNumber: z.string().min(2).max(15) }).parse(ctx.params);

    const messages = await MessageService.getConversation(ctx, phoneNumber);

    ctx.body = {
      ok: true,
      payload: messages,
    };
  } catch (error) {
    handleError(error, ctx);
  }

  await next();
});
