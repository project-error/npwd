import { getSourceFromDeviceIdentifier } from '../middlewares/deviceMiddleware';
import DeviceService from '../services/DeviceService';

export const getPlayerSrcBySid = async (sid: number): Promise<number> => {
  console.log('Getting player source by SIM card id', sid);

  const device = await DeviceService.getDeviceBySid(sid);

  /**
   * Fetch all players, filter by their license then return who has matching license.
   */
  const src = getSourceFromDeviceIdentifier(device.identifier);

  console.log('Found player with matching identifier', src);

  return src;
};
