import React, {
  createContext,
  useState,
  useCallback,
  useMemo,
  useRef,
  useEffect,
} from 'react';
import { useRecoilValue } from 'recoil';
import { phoneState } from '../../phone/hooks/state';
import { DEFAULT_ALERT_HIDE_TIME } from '../notifications.constants';

export interface INotification {
  app: string;
  id?: string;
  title: string;
  content?: React.ReactNode;
  icon?: JSX.Element;
  notificationIcon?: JSX.Element;
  cantClose?: boolean;
  keepWhenPhoneClosed?: boolean;
  onClose?: (notification: INotification) => void;
  onClick?: (notification: INotification) => void;
}

type INotificationAlert = INotification & {
  onClickAlert(e?: any): void;
  onCloseAlert(e?: any): void;
  resolve(): void;
};

interface INotificationIcon {
  key: string;
  icon: JSX.Element;
  badge: number;
}

export const NotificationsContext = createContext<{
  barUncollapsed: boolean;
  setBarUncollapsed: (v: boolean | ((c: boolean) => boolean)) => void;
  notifications: INotification[];
  currentAlert: INotificationAlert;
  icons: INotificationIcon[];
  count: number;
  removeAlerts(): void;
  addOrUpdateNotification(add: INotification, update?: INotification): void;
  addNotification(value: INotification): void;
  removeNotification(idx: number): void;
  updateId(id: string, value: Partial<INotification>): void;
  removeId(id: string): void;
  hasNotification(app: string): number;
  addNotificationAlert(
    n: INotification,
    persist: boolean,
    update?: Partial<INotification>
  );
}>(null);

export function NotificationsProvider({ children }) {
  const isPhoneOpen = useRecoilValue(phoneState.visibility);

  const [barUncollapsed, setBarUncollapsed] = useState<boolean>(false);

  const [notifications, setNotifications] = useState<INotification[]>([]);

  const alertTimeout = useRef<NodeJS.Timeout>();
  const [alerts, setAlerts] = useState<
    Array<[INotification, boolean, Partial<INotification>]>
  >([]);
  const [currentAlert, setCurrentAlert] = useState<INotificationAlert>();

  useEffect(() => {
    if (isPhoneOpen && currentAlert && currentAlert.keepWhenPhoneClosed) {
      currentAlert.resolve();
    }
  }, [isPhoneOpen, currentAlert]);

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

  const removeNotification = (idx) => {
    setNotifications((all) => {
      const updated = all;
      updated.splice(idx, 1);
      return [...updated];
    });
  };

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

        const onExit = (cb) => () => {
          cb?.(n);
          clearTimeout(alertTimeout.current);
          resolve();
        };

        setCurrentAlert({
          ...n,
          resolve,
          onClickAlert: onExit(n.onClick),
          onCloseAlert: onExit(n.onClose),
        });

        if (n.keepWhenPhoneClosed) {
          return;
        }

        alertTimeout.current = setTimeout(() => {
          resolve();
          // If you change or remove the 300 i'll kill your pet - Kidz /s
          // Really, this makes it work nicely with usePhoneVisibility :)
        }, DEFAULT_ALERT_HIDE_TIME + 300);
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

  const removeId = (id: string) => {
    const idx = notifications.findIndex((n) => n.id === id);
    if (idx !== -1) {
      removeNotification(idx);
    }
  };

  const updateId = (id: string, value: Partial<INotification>) => {
    const idx = notifications.findIndex((n) => n.id === id);
    if (idx !== -1) {
      const curr = { ...notifications[idx], ...value };
      updateNotification(idx, curr);
    }
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

  const removeAlerts = () => {
    setAlerts([]);
    setCurrentAlert(null);
  };

  return (
    <NotificationsContext.Provider
      value={{
        setBarUncollapsed,
        barUncollapsed,
        currentAlert,
        notifications,
        removeAlerts,
        addNotification,
        removeNotification,
        updateId,
        removeId,
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
