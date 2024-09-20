import { useQuery } from '@tanstack/react-query';
import { queryClient } from '../../Providers';
import { getActiveCall } from '../device';
import { useBroadcastEvent } from '../../hooks/useBroadcastEvent';
import { Call } from '../../../../shared/Types';
import { useNotifications } from '@/contexts/NotificationContext/useNotifications';
import { useCurrentDevice } from './useCurrentDevice';

type ActiveCallResult = Awaited<ReturnType<typeof getActiveCall>>['payload'] | undefined;

export const useActiveCall = (): [ActiveCallResult, (setEmpty?: boolean) => void, () => void] => {
  const currentDevice = useCurrentDevice();
  const { add } = useNotifications();
  const { data, refetch } = useQuery({
    initialData: null,
    queryKey: ['active-call'],
    queryFn: getActiveCall,
    throwOnError: false,
    networkMode: 'online',
    staleTime: 0,
  });

  const invalidate = async () => {
    await queryClient.invalidateQueries({
      queryKey: ['active-call'],
      refetchType: 'all',
    });
  };

  useBroadcastEvent<Call>('active-call:updated', (data) => {
    console.log('active-call:updated', data);
    console.log('Setting active call to:', data);

    if (!data?.ended_at && !data?.declined_at && currentDevice?.sim_card_id === data?.receiver_id) {
      add({
        type: 'call',
        appId: 'calls',
        title: 'Incoming Call',
        path: '/apps/calls/call',
        description: `Incoming call from ${data?.caller_id}`,
      });
    }

    queryClient.setQueryData(['active-call'], { payload: data });
  });

  return [data?.payload, invalidate, refetch];
};
