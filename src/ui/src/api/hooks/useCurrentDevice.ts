import { useQuery } from '@tanstack/react-query';
import { getCurrentDevice } from '../device';
import { useBroadcastEvent } from '../../hooks/useBroadcastEvent';
import { Device } from '../../../../shared/Types';
import { queryClient } from '../../Providers';

export const useCurrentDevice = () => {
  const { data } = useQuery({
    initialData: null,
    queryKey: ['current-device'],
    queryFn: getCurrentDevice,
  });

  useBroadcastEvent<Device>('current-device:updated', (data) => {
    console.log('current-device:updated', data);
    queryClient.setQueryData(['current-device'], { payload: data });
  });

  useBroadcastEvent<Device>('current-device:set', (data) => {
    console.log('current-device:set', data);
    queryClient.setQueryData(['current-device'], { payload: data });
  });

  return data?.payload || null;
};
