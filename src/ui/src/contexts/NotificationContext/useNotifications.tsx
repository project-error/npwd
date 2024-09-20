import { useContext } from 'react';
import { Notification, NotificationsContext } from '.';
import { DEFAULT_NOTIFICATION_TIMEOUT } from '@/constants';

export const useNotifications = () => {
  const context = useContext(NotificationsContext);

  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }

  const handleCreateNotification = (
    notification: Omit<Notification, 'id' | 'created_at' | 'timeout'> & {
      timeout?: number;
    },
  ) => {
    context.setNotifications((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).substring(7),
        ...notification,
        timeout: notification.timeout || DEFAULT_NOTIFICATION_TIMEOUT,
        created_at: new Date().toISOString(),
      },
    ]);
  };

  const handleRemoveNotification = (notificationId: string) => {
    console.log('removing notification', notificationId);
    context.setNotifications((prev) =>
      prev.filter((notification) => notification.id !== notificationId),
    );
  };

  const sortedNotifications = [...context.notifications].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );

  const handleClearNotifications = () => {
    context.setNotifications([]);
  };

  return {
    add: handleCreateNotification,
    remove: handleRemoveNotification,
    clear: handleClearNotifications,
    notifications: sortedNotifications,
  };
};
