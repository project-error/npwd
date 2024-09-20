import { useNotifications } from '@/contexts/NotificationContext/useNotifications';
import { useBroadcastEvent } from '@/hooks/useBroadcastEvent';
import { MessageWithPhoneNumbers } from '../../../../shared/Types';
import { useCurrentDevice } from './useCurrentDevice';

export const useMessagesNotifications = () => {
  const currentDevice = useCurrentDevice();
  const { add } = useNotifications();

  useBroadcastEvent<MessageWithPhoneNumbers>('message:new-message', (data) => {
    if (!data || !currentDevice) {
      return;
    }

    if (data.receiver_id === currentDevice?.sim_card_id) {
      add({
        title: data.sender_phone_number,
        path: `/apps/conversation/${data.sender_phone_number}`,
        description: data.content,
        type: 'generic',
        appId: 'messages',
        timeout: 5000,
      });
    }
  });
};
