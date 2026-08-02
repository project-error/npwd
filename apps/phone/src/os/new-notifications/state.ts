import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';
import { NPWDNotification, UnreadNotificationBarProps } from '@typings/notifications';

const defaultNotification = (id: string): NPWDNotification => ({
  appId: '',
  key: id,
  id,
  content: '',
  secondaryTitle: '',
  path: '',
  onClick: null,
  keepOpen: false,
  duration: 0,
  isRead: false,
  isActive: false,
});

export const notificationsAtom = atom<Record<string, NPWDNotification>>({});

export const notifications = (id: string) =>
  atom((get) => get(notificationsAtom)[id] ?? defaultNotification(id));

export const activeNotificationIds = atom<string[]>([]);

export const allNotificationIds = atom<string[]>([]);

export const unreadNotificationIds = atom<string[]>([]);

export const unreadNotifications = atom<UnreadNotificationBarProps[]>([]);

export const barUncollapsed = atom<boolean>(false);

/* Returns all notification IDs for the specified app ID */
export const useNotificationsForApp = (appId: string) => {
  const allNotisIds = useAtomValue(allNotificationIds);
  const notificationMap = useAtomValue(notificationsAtom);

  return allNotisIds
    .map((id: string) => notificationMap[id] ?? defaultNotification(id))
    .filter((n: NPWDNotification) => n.appId === appId);
};

/* Returns all unread notification IDs for the specified app ID */
export const useUnreadNotificationsForApp = (appId: string) => {
  const allNotisIds = useAtomValue(allNotificationIds);
  const notificationMap = useAtomValue(notificationsAtom);

  return allNotisIds
    .map((id: string) => notificationMap[id] ?? defaultNotification(id))
    .filter((n: NPWDNotification) => !n.isRead && n.appId === appId);
};

export const useNavbarUncollapsed = () => useAtom(barUncollapsed);
export const useSetNavbarUncollapsed = () => useSetAtom(barUncollapsed);

export const useUnreadNotificationIds = () => useAtomValue(unreadNotificationIds);
export const useUnreadNotifications = () => useAtomValue(unreadNotifications);
export const useNotificationValue = (id: string) => {
  const notificationMap = useAtomValue(notificationsAtom);
  return notificationMap[id] ?? defaultNotification(id);
};
export const useActiveNotificationIds = () => useAtomValue(activeNotificationIds);
