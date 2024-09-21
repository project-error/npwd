import { useContext } from 'react';
import { NotificationsContext } from '.';
import { DEFAULT_NOTIFICATION_TIMEOUT } from '@/constants';
import { useLocation } from 'react-router';
import { InsertNotification } from '../../../../shared/Types';

export const useNotifications = () => {
  const { pathname } = useLocation();
  const context = useContext(NotificationsContext);

  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }

  const handleCreateNotification = (notification: InsertNotification) => {
    /**
     * If the notification is for the current path, don't show it.
     */
    if (notification.path === pathname) {
      return;
    }

    context.setNotifications((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).substring(7),
        ...notification,
        type: notification.type || 'generic',
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
