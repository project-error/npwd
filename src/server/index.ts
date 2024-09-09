import { initDB } from './database/knex';
import { App, Router } from 'fivem-router/server';
import CallService from './services/CallService';

function bootstrap() {
  initDB();

  const app = new App(true);
  const router = new Router();

  console.log('---------------------------------------------------------');
  router.add('/hello', async (ctx, next) => {
    const call = await CallService.getCallById('1');

    if (!call) {
      ctx.status = 404;
      return;
    }

    ctx.body = { call };
    await next();
  });

  router.add('/calls/create', async (ctx, next) => {
    const parsedBody = JSON.parse(ctx.request.body);

    if (!parsedBody.phoneNumber) {
      ctx.status = 400;
      return;
    }

    try {
      const call = await CallService.call(parsedBody.phoneNumber);
      ctx.body = {
        ok: true,
        payload: call,
      };
    } catch (error) {
      ctx.status = 400;
      ctx.body = {
        ok: false,
        error: error.message,
      };
    }

    await next();
  });

  router.add('/calls', async (ctx, next) => {
    const calls = await CallService.getCalls();

    ctx.body = { calls };
    await next();
  });

  router.add('/orre-borre', async (ctx) => {
    ctx.body = { message: 'Orre borre' };
  });

  app.use(router.routes());
  app.use(router.allowedMethods());

  app.listen(3001);
}

const isRunningIngame = typeof RegisterCommand !== 'undefined';

if (!isRunningIngame) {
  global.GetConvar = (_: string, defaultValue: string) => {
    return defaultValue;
  };
}

bootstrap();
