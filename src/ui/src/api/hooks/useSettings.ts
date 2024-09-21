import { queryClient } from '@/Providers';
import { Settings } from '../../../../shared/Types';
import { updateDeviceSettings } from '../settings';
import { useCurrentDevice } from './useCurrentDevice';

export const useSettings = () => {
  const currentDevice = useCurrentDevice();

  const handleUpdateSettings = async (settings: Partial<Settings>) => {
    if (currentDevice) {
      const updatedDevice = await updateDeviceSettings(currentDevice.id, {
        ...currentDevice.settings,
        ...settings,
      });
      queryClient.setQueryData(['current-device'], updatedDevice);
    }
  };

  return { settings: currentDevice?.settings || null, update: handleUpdateSettings };
};
