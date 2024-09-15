import { Router } from 'fivem-router';
import { handleError } from '../utils/errors';
import ConversationService from '../services/ConversationService';
import z from 'zod';

export const conversationsRouter = new Router({
  prefix: '/conversations',
});

conversationsRouter.add('/', async (ctx, next) => {
  /** Return my messages */
  try {
    const conversations = await ConversationService.getMyConversations(ctx);

    ctx.body = {
      ok: true,
      payload: conversations,
    };
  } catch (error) {
    handleError(error, ctx);
  }
});

conversationsRouter.add('/:phoneNumber', async (ctx, next) => {
  try {
    const { phoneNumber } = z.object({ phoneNumber: z.string().min(2).max(15) }).parse(ctx.params);

    const messages = await ConversationService.getConversation(ctx, phoneNumber);
    console.log(messages);

    ctx.body = {
      ok: true,
      payload: messages,
    };
  } catch (error) {
    handleError(error, ctx);
  }
});
