import { Router } from 'fivem-router';
import { z } from 'zod';
import { handleError } from '../utils/errors';
import DeviceService from '../services/DeviceService';
import SimCardService from '../services/SimCardService';

export const devicesRouter = new Router({
  prefix: '/devices',
});

const registerDeviceSchema = z.object({
  phoneNumber: z.string().min(5).max(15),
});

devicesRouter.add('/', async (ctx, next) => {
  try {
    const devices = await DeviceService.getDevices();
    ctx.body = {
      ok: true,
      payload: devices,
    };
  } catch (error) {
    handleError(error, ctx);
  }

  await next();
});

devicesRouter.add('/register', async (ctx, next) => {
  try {
    console.log('ctx.request.body', ctx.request.body);
    const { phoneNumber } = registerDeviceSchema.parse(ctx.request.body);

    const framework = GetConvar('npwd:framework', 'standalone');
    if (ctx.device && framework === 'standalone') {
      ctx.throw(400, 'Device already registered');
      return;
    }

    console.log('phoneNumber', phoneNumber);
    const simCard = await SimCardService.createSimCard({
      phone_number: phoneNumber,
    });

    const device = await DeviceService.createDevice({
      sim_card_id: simCard.id,
      identifier: ctx.device.identifier,
    });

    console.log('current-device:updated', device);
    ctx.emitNui('current-device:updated', device);

    ctx.status = 200;
    ctx.body = {
      ok: true,
      payload: device,
    };
  } catch (error) {
    handleError(error, ctx);
  }

  await next();
});

devicesRouter.add('/current', async (ctx, next) => {
  try {
    ctx.body = {
      ok: true,
      payload: ctx.device,
    };
  } catch (error) {
    handleError(error, ctx);
  }

  await next();
});

const updateSettingsSchema = z.object({
  settings: z.record(z.unknown()),
});

devicesRouter.add('/update-settings', async (ctx, next) => {
  try {
    const { settings } = updateSettingsSchema.parse(ctx.request.body);
    const device = await DeviceService.updateDeviceSettings(ctx.device.id, settings);

    ctx.body = {
      ok: true,
      payload: device,
    };
  } catch (error) {
    handleError(error, ctx);
  }

  await next();
});
