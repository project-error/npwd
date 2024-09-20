import { ok } from 'assert';
import { RouterContext } from 'fivem-router';
import { z } from 'zod';
import { handleError } from '../utils/errors';
import PlayerService from '../services/PlayerService';

const selectDeviceSchema = z.object({
  deviceIdentifier: z.string(),
});

export const selectDeviceMiddleware = async (ctx: RouterContext, next: () => Promise<void>) => {
  if (ctx.url !== '/select-device') {
    return next();
  }

  try {
    const { deviceIdentifier } = selectDeviceSchema.parse(ctx.request.body);
    await PlayerService.selectDevice(ctx.source, deviceIdentifier);
    ctx.status = 200;
    ctx.body = {
      ok: true,
      message: `Device selected: ${deviceIdentifier}`,
    };
  } catch (error) {
    handleError(error, ctx);
  }
};
