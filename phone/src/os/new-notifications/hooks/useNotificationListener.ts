import { useNuiEvent } from 'fivem-nui-react-lib';
import { useNotifications } from './useNotifications';
import { NotificationEvents, QueueNotificationOptsReadonly } from '@typings/notifications';

export const useNotificationListener = () => {
  const { createNotification, removeActive, removeAllActive, markAsRead, clearAllNotifications } =
    useNotifications();

  useNuiEvent<QueueNotificationOptsReadonly>(
    'PHONE',
    NotificationEvents.QUEUE_NOTIFICATION,
    (opts) => {
      console.log('running');
      createNotification(opts);
    },
  );
  useNuiEvent('PHONE', NotificationEvents.SET_NOTIFICATION_INACTIVE, removeActive);
  useNuiEvent('PHONE', NotificationEvents.SET_ALL_NOTIFICATIONS_INACTIVE, removeAllActive);
  useNuiEvent('PHONE', NotificationEvents.MARK_NOTIFICATION_AS_READ, markAsRead);
  useNuiEvent('PHONE', NotificationEvents.CLEAR_NOTIFICATIONS, clearAllNotifications);
};
