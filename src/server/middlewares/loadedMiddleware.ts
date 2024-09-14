import { RouterContext } from 'fivem-router';
import { handleError } from '../utils/errors';

export const loadedMiddleware = async (
  ctx: Omit<RouterContext, 'deviceId' | 'device'>,
  next: () => Promise<void>,
) => {
  if (ctx.url !== '/client-loaded') {
    return;
  }

  const isDevelopmentMode = GetConvar('is_development', 'true') === 'true';

  try {
    const players = getPlayers();
    console.log('Players', players);
  } catch (e) {
    console.log(e);
  }

  if (isDevelopmentMode) {
    console.log('Development mode detected, skipping loaded middleware');
    await next();
    return;
  }

  try {
    ctx.status = 200;
    ctx.body = {
      ok: true,
    };
  } catch (error) {
    handleError(error, ctx);
  }

  await next();
};
