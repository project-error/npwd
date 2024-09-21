import { RouterContext } from 'fivem-router';
import { DeviceIdentifierNotFound, DeviceNotFoundError } from '../../shared/Errors';
import { DeviceWithSimCard } from '../../shared/Types';
import DeviceRepository from '../repositories/DeviceRepository';
import PlayerRepository from '../services/PlayerService';
import { handleError } from '../utils/errors';

declare module 'fivem-router' {
  interface RouterContext {
    device: DeviceWithSimCard;
  }
}

export const deviceMiddleware = async (ctx: RouterContext, next: () => Promise<void>) => {
  const deviceIdentifier = PlayerRepository.getDevice(ctx.source);
  console.log('deviceMiddleware: deviceIdentifier', deviceIdentifier);

  try {
    if (!deviceIdentifier) {
      throw new DeviceIdentifierNotFound();
    }

    const device = await DeviceRepository.getDeviceByIdentifier(deviceIdentifier);
    console.log('deviceMiddleware: device', device);
    if (!device) {
      throw new DeviceNotFoundError();
    }

    ctx.device = device;

    await next();
  } catch (error) {
    handleError(error, ctx);
  }
};
