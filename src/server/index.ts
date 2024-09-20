import './global';
import { initDB } from './database/knex';
import { App, Router } from 'fivem-router/server';
import { callsRouter } from './router/calls';
import { parseBodyMiddleware } from './middlewares/parseBodyMiddleware';
import { sourceMiddleware } from './middlewares/sourceMiddleware';
import { deviceMiddleware } from './middlewares/deviceMiddleware';
import { devicesRouter } from './router/devices';
import { activeCallRouter } from './router/activeCall';
import {
  BROADCAST_EVENT_LISTENER,
  CLIENT_EVENT_LISTENER,
  SERVER_EVENT_LISTENER,
} from '../shared/network';
import { parseObjectToIsoString } from './utils/date';
import { emitMiddleware } from './middlewares/emitMiddleware';
import { messagesRouter } from './router/messages';
import { conversationsRouter } from './router/conversations';
import { contactsRouter } from './router/contacts';

function bootstrap() {
  initDB();

  const app = new App({
    debug: true,
    listeners: {
      server: SERVER_EVENT_LISTENER,
      client: CLIENT_EVENT_LISTENER,
      broadcast: BROADCAST_EVENT_LISTENER,
    },
  });

  const router = new Router();

  app.use(emitMiddleware);
  app.use(sourceMiddleware);
  app.use(deviceMiddleware);
  app.use(parseBodyMiddleware);

  /**
   * Add routers
   */
  app.use(activeCallRouter.routes());
  app.use(callsRouter.routes());
  app.use(devicesRouter.routes());
  app.use(messagesRouter.routes());
  app.use(conversationsRouter.routes());
  app.use(contactsRouter.routes());

  app.use(router.routes());

  app.use(async (ctx, next) => {
    ctx.body = parseObjectToIsoString(ctx.body);
  });

  app.listen(3001);
}

bootstrap();
