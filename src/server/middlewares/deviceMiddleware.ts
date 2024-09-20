import { RouterContext } from 'fivem-router';
import z from 'zod';
import { DeviceWithSimCard } from '../../shared/Types';
import DeviceRepository from '../repositories/DeviceRepository';

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
  const { data: headerDeviceId } = z.coerce
    .number()
    .safeParse(ctx.request?.headers?.['x-device-id']);

  let deviceIdentifier = !headerDeviceId ? getDeviceIdentifierBySource(ctx.source) : '';

  if (!deviceIdentifier && !headerDeviceId) {
    ctx.throw(401, 'Device ID not found. Are you calling this from the server?');
    return next();
  }

  try {
    let device;

    if (headerDeviceId) {
      device = await DeviceRepository.getDeviceById(headerDeviceId);
    } else {
      device = await DeviceRepository.getDeviceByIdentifier(deviceIdentifier);
    }

    if (!device && ctx.url === '/devices/register') {
      console.log('Device not found, registering new device');
      await next();
      return;
    }

    if (!device) {
      ctx.throw(401, 'Device not found');
      return next();
    }

    ctx.device = device;
  } catch (error) {
    ctx.throw(401, 'Device not found');
  }

  await next();
};
