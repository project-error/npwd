import React, {
  createContext,
  useState,
  useCallback,
  useMemo,
  useRef,
  useEffect,
} from 'react';

export interface INotification {
  app: string;
  title: string;
  content?: React.ReactNode;
  icon?: JSX.Element;
  notificationIcon?: JSX.Element;
  onClick?: (notification: INotification) => void;
}

interface INotificationIcon {
  key: string;
  icon: JSX.Element;
  badge: number;
}

export const NotificationsContext = createContext<{
  notifications: INotification[];
  currentAlert: INotification;
  icons: INotificationIcon[];
  count: number;
  addOrUpdateNotification(add: INotification, update?: INotification): void;
  addNotification(value: INotification): void;
  updateNotification(idx: number, value: INotification): void;
  removeNotification(idx: number): void;
  hasNotification(app: string): number;
  addNotificationAlert(
    n: INotification,
    persist: boolean,
    update?: Partial<INotification>
  );
}>(null);

const DEFAULT_ALERT_HIDE_TIME = 3000;

export function NotificationsProvider({ children }) {
  const [notifications, setNotifications] = useState<INotification[]>([]);

  const alertTimeout = useRef<NodeJS.Timeout>();
  const [alerts, setAlerts] = useState<
    Array<[INotification, boolean, Partial<INotification>]>
  >([]);
  const [currentAlert, setCurrentAlert] = useState<INotification>();

  const updateNotification = useCallback(
    (idx: number, value: INotification) => {
      setNotifications((all) => {
        const updated = [...all];
        updated.splice(idx, 1, value);
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

  /**
   * Checks if a notification exists for current app
   * and returns its index or -1 if not found.
   */
  const hasNotification = useCallback(
    (appId: string): number => {
      return notifications.findIndex((n) => n.app === appId);
    },
    [notifications]
  );

  const addOrUpdateNotification = useCallback(
    (add: INotification, update?: INotification) => {
      const exists = hasNotification(add.app);
      if (update && exists !== -1) {
        updateNotification(exists, update);
        return;
      }
      addNotification(add);
    },
    [addNotification, hasNotification, updateNotification]
  );

  const _showAlert = useCallback(
    (n: INotification, persist: boolean, update: Partial<INotification>) => {
      return new Promise<void>((res) => {
        const resolve = () => {
          if (persist) {
            addOrUpdateNotification(n, update ? { ...n, ...update } : null);
          }
          res();
        };

        alertTimeout.current = setTimeout(() => {
          resolve();
        }, DEFAULT_ALERT_HIDE_TIME);

        setCurrentAlert({
          ...n,
          onClick: () => {
            clearTimeout(alertTimeout.current);
            n.onClick?.(n);
            resolve();
          },
        });
      });
    },
    [addOrUpdateNotification]
  );

  const addNotificationAlert = (
    n: INotification,
    persist?: boolean,
    update?: Partial<INotification>
  ) => {
    setAlerts((curr) => [...curr, [n, persist, update]]);
  };

  useEffect(() => {
    if (!currentAlert && alerts.length) {
      _showAlert(...alerts[0]).then(() => {
        setAlerts((curr) => {
          const newQueue = curr;
          curr.shift();
          return newQueue;
        });
        setCurrentAlert(null);
      });
    }
  }, [_showAlert, alerts, currentAlert]);

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
        currentAlert,
        notifications,
        addNotification,
        updateNotification,
        removeNotification,
        hasNotification,
        addNotificationAlert,
        addOrUpdateNotification,
        icons,
        count: notifications.length,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}
