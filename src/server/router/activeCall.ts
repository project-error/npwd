import { Router } from 'fivem-router';
import CallService from '../services/CallService';
import { handleError } from '../utils/errors';
import { parseObjectToIsoString } from '../utils/date';

export const activeCallRouter = new Router({
  prefix: '/calls/active',
});

activeCallRouter.add('/', async (ctx, next) => {
  try {
    const call = await CallService.getActiveCall(ctx);

    ctx.status = 200;
    ctx.body = {
      ok: true,
      payload: call,
    };
  } catch (error) {
    handleError(error, ctx);
  }

  await next();
});

activeCallRouter.add('/accept', async (ctx, next) => {
  try {
    const call = await CallService.acceptActiveCall(ctx);
    await CallService.broadcastCallUpdate(ctx, call);

    ctx.status = 200;
    ctx.body = {
      ok: true,
      payload: call,
    };
  } catch (error) {
    handleError(error, ctx);
  }
});

activeCallRouter.add('/decline', async (ctx, next) => {
  try {
    const call = await CallService.declineActiveCall(ctx);
    await CallService.broadcastCallUpdate(ctx, call);

    console.log('Declined call', call);
    console.log('Declined call', parseObjectToIsoString(call));

    ctx.status = 200;
    ctx.body = {
      ok: true,
      payload: call,
    };
  } catch (error) {
    handleError(error, ctx);
  }
});

activeCallRouter.add('/end', async (ctx, next) => {
  try {
    const call = await CallService.endActiveCall(ctx);
    await CallService.broadcastCallUpdate(ctx, call);

    ctx.status = 200;
    ctx.body = {
      ok: true,
      payload: call,
    };
  } catch (error) {
    handleError(error, ctx);
  }
});
