import { instance } from '@/utils/fetch';
import { DeviceWithSimCard } from '../../../shared/Types';

export const updateDeviceSettings = async (deviceId: number, settings: Record<string, unknown>) => {
  const response = await instance.post<{ payload: DeviceWithSimCard }>('/devices/update-settings', {
    deviceId,
    settings,
  });
  return response.data;
};
