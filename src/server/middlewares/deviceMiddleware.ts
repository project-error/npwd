import { RouterContext } from 'fivem-router';
import z from 'zod';
import { DeviceWithSimCard } from '../../shared/Types';
import DeviceRepository from '../repositories/DeviceRepository';
import PlayerService from '../services/PlayerService';
import { handleError } from '../utils/errors';
import { DeviceNotFoundError } from '../../shared/Errors';

declare module 'fivem-router' {
  interface RouterContext {
    device: DeviceWithSimCard;
  }
}

// TODO: Implement the logic to check if the user has the phone making the call.

export const getDeviceIdentifierBySource = (src: number) => {
  console.log('Get device identifier by source', src);
  const framework = GetConvar('npwd:framework', 'standalone');
  const isDevelopmentMode = GetConvar('is_development', 'true') === 'true';

  const playerLicenses = getPlayerIdentifiers(src);
  const playerLicense =
    playerLicenses.find((license) => license.startsWith('license:')) || playerLicenses[0];

  if (framework === 'standalone' && isDevelopmentMode) {
    return `${src}:${playerLicense}`;
  }

  return playerLicense;
};

export const getSourceFromDeviceIdentifier = (deviceIdentifier: string) => {
  const players = getPlayers();

  for (const player of players) {
    const deviceIdentifierBySource = getDeviceIdentifierBySource(parseInt(player));
    if (deviceIdentifierBySource === deviceIdentifier) {
      return parseInt(player);
    }
  }

  return null;
};

try {
  const players = global.getPlayers();
  console.log('Players', players);
} catch (e) {
  console.log(e);
}

export const deviceMiddleware = async (ctx: RouterContext, next: () => Promise<void>) => {
  const deviceIdentifier = PlayerService.getDevice(ctx.source);

  try {
    if (!deviceIdentifier) {
      throw new DeviceNotFoundError('CALLER');
    }

    const device = await DeviceRepository.getDeviceByIdentifier(deviceIdentifier);

    if (!device && ctx.url === '/devices/register') {
      console.log('Device not found, registering new device');
      await next();
      return;
    }

    if (!device) {
      throw new DeviceNotFoundError('CALLER');
    }

    ctx.device = device;

    await next();
  } catch (error) {
    handleError(error, ctx);
  }
};
