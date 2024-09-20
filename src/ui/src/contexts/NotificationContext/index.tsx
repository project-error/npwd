import { createContext, PropsWithChildren, useState } from 'react';
import { useNuiEvent } from 'react-fivem-hooks';

export interface Notification {
  id: string;
  path: string;
  type: 'call' | 'generic';
  title: string;
  timeout: number;
  description: string;
  created_at: string;

  appId?: string;
  overline?: string;
  dismissable?: boolean;
}

export type InsertNotification = Omit<Notification, 'id' | 'created_at' | 'timeout'> & {
  timeout?: number;
  dismissable?: boolean;
};

export type NotificationContextType = {
  notifications: Notification[];
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
};

export const NotificationsContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationsProvider = ({ children }: PropsWithChildren) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const handleCreateNotification = (notificationStr: string) => {
    try {
      const notification = JSON.parse(notificationStr) as InsertNotification;
      console.log('Trying to create notification ..', notification);

      const id = Math.random().toString(36).substring(7);
      const created_at = new Date().toISOString();
      const timeout = notification.timeout || 5000;

      const newNotification = {
        id,
        created_at,
        timeout,
        dismissable:
          typeof notification.dismissable !== 'undefined' ? notification.dismissable : true,
        ...notification,
      };

      console.log('Created notification:', newNotification);
      setNotifications((prev) => [...prev, newNotification]);
    } catch (error) {
      console.error('Could not parse notification', error);
    }
  };

  useNuiEvent({
    event: 'ADD_NOTIFICATION',
    callback: handleCreateNotification,
  });

  return (
    <NotificationsContext.Provider value={{ notifications, setNotifications }}>
      {children}
    </NotificationsContext.Provider>
  );
};
