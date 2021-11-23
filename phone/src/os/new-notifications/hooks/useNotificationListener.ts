import { useNuiEvent } from 'fivem-nui-react-lib';
import { useNotifications } from './useNotifications';
import { PhoneEvents } from '../../../../../typings/phone';

export const useNotificationListener = () => {
  const { queueNotification } = useNotifications();
  useNuiEvent('PHONE', PhoneEvents.QUEUE_NOTIFICATION, queueNotification);
};
