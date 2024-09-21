import { Router } from 'fivem-router';
import { z } from 'zod';
import DeviceService from '../services/DeviceService';
import PlayerService from '../services/PlayerService';
import SimCardService from '../services/SimCardService';
import { handleError } from '../utils/errors';
import { InsertNotification } from '../../shared/Types';

export const authRouter = new Router({
  prefix: '/auth',
});

const selectDeviceSchema = z.object({
  deviceIdentifier: z.string(),
});

authRouter.add('/select-device', async (ctx) => {
  try {
    const { deviceIdentifier } = selectDeviceSchema.parse(ctx.request.body);
    await PlayerService.selectDevice(ctx.source, deviceIdentifier);

    /** Get device from DB */
    const device = await DeviceService.getDeviceByIdentifier(deviceIdentifier);
    ctx.emitToNui(ctx.source, 'current-device:set', device);

    ctx.status = 200;
    ctx.body = {
      ok: true,
      message: `Device selected: ${deviceIdentifier}`,
    };
  } catch (error) {
    handleError(error, ctx);
  }
});

const registerDeviceSchema = z.object({
  deviceIdentifier: z.string(),
  phoneNumber: z.string(),
});

authRouter.add('/register-device', async (ctx) => {
  try {
    const { deviceIdentifier, phoneNumber } = registerDeviceSchema.parse(ctx.request.body);

    // TODO: Implement transaction to rollback if one of the operations fails. We don't want to have a sim card without a device or vice versa.
    const simCard = await SimCardService.createSimCard({
      phone_number: phoneNumber,
    });

    const device = await DeviceService.createDevice({
      identifier: deviceIdentifier,
      sim_card_id: simCard.id,
    });

    ctx.status = 200;
    ctx.body = {
      ok: true,
      message: 'New device registered',
      payload: device,
    };
  } catch (error) {
    console.log('Error', error);
    handleError(error, ctx);
  }
});

const getDeviceSchema = z.object({
  deviceIdentifier: z.string(),
});
authRouter.add('/source-by-device', async (ctx) => {
  try {
    const { deviceIdentifier } = getDeviceSchema.parse(ctx.request.body);
    const source = await PlayerService.getSourceFromDevice(deviceIdentifier);

    ctx.status = 200;
    ctx.body = {
      ok: true,
      payload: source,
    };
  } catch (error) {
    handleError(error, ctx);
  }
});

// export const emitTo = (source: number, event: string, data: unknown) => {
//   if (!isRunningInGame()) return;
//   emitNet(event, source, data);
// };

authRouter.add('/debug', async (ctx, next) => {
  try {
    const authorized = await PlayerService.authorizeDevice(ctx.source, 'debug');
    const authNotification: InsertNotification = {
      title: 'Auth Notification',
      description: `You are ${authorized ? 'authorized' : 'not authorized'} to debug`,
      appId: 'settings',
      path: '/home',
    };

    console.log('Emitting: npwd:add-notification', ctx.source, authNotification);
    emitNet('npwd:add-notification', ctx.source, JSON.stringify(authNotification));

    console.log('Authorized', authorized);

    ctx.status = 200;
    ctx.body = {
      ok: true,
      message: 'Debugging devices',
      payload: authorized,
    };

    return next();
  } catch (error) {
    handleError(error, ctx);
  }
});
