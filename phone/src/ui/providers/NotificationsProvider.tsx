import React, { createContext, useState, useCallback, useMemo } from 'react';

export interface INotification {
  app: string;
  title: string;
  content?: React.ReactNode;
  icon?: JSX.Element;
  notificationIcon?: JSX.Element;
  href?: string;
}

interface INotificationIcon {
  key: string;
  icon: JSX.Element;
  badge: number;
}

export const NotificationsContext = createContext<{
  notifications: INotification[];
  icons: INotificationIcon[];
  count: number;
  addNotification(value: INotification): void;
  updateNotification(idx: number, value: INotification): void;
  removeNotification(idx: number): void;
}>(null);

export function NotificationsProvider({ children }) {
  const [notifications, setNotifications] = useState<INotification[]>([]);

  const updateNotification = useCallback(
    (idx: number, value: INotification) => {
      setNotifications((all) => {
        const updated = [...all];
        updated.splice(idx, 0, value);
        return updated;
      });
    },
    []
  );

  const removeNotification = useCallback((idx) => {
    setNotifications((all) => {
      const updated = [...all];
      updated.splice(idx, 1);
      return updated;
    });
  }, []);

  const addNotification = useCallback((value: INotification) => {
    setNotifications((all) => [value, ...all]);
  }, []);

  const icons: INotificationIcon[] = useMemo(
    () =>
      notifications.reduce((icons, curr) => {
        const find = icons.findIndex((i) => i.key === curr.app);
        if (find !== -1) {
          icons[find].badge++;
          return icons;
        }
        icons.unshift({ key: curr.app, icon: curr.notificationIcon, badge: 1 });
        return icons;
      }, []),
    [notifications]
  );

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        addNotification,
        updateNotification,
        removeNotification,
        icons,
        count: notifications.length,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}
