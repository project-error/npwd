import { useNuiEvent } from 'fivem-nui-react-lib';
import { useNotifications } from './useNotifications';
import { NotificationEvents } from '@typings/notifications';

export const useNotificationListener = () => {
  const { createNotification, removeActive, removeAllActive, markAsRead, clearAllNotifications } =
    useNotifications();

  useNuiEvent('PHONE', NotificationEvents.QUEUE_NOTIFICATION, createNotification);
  useNuiEvent('PHONE', NotificationEvents.SET_NOTIFICATION_INACTIVE, removeActive);
  useNuiEvent('PHONE', NotificationEvents.SET_ALL_NOTIFICATIONS_INACTIVE, removeAllActive);
  useNuiEvent('PHONE', NotificationEvents.MARK_NOTIFICATION_AS_READ, markAsRead);
  useNuiEvent('PHONE', NotificationEvents.CLEAR_NOTIFICATIONS, clearAllNotifications);
};
