import { atom, atomFamily, selectorFamily, useRecoilValue } from 'recoil';
import { NPWDNotification } from '@typings/notifications';

export const storedNotificationsFamily = atomFamily<NPWDNotification, string>({
  key: 'storedNotifications',
  default: (uniqId) => ({
    route: false,
    isRead: false,
    message: '',
    key: uniqId,
    persist: false,
    duration: 0,
    appId: '',
    isActive: false,
    uniqId,
    timeReceived: new Date(),
  }),
});

export const activeNotificationsIds = atom<string[]>({
  key: 'activeNotificationsIds',
  default: [],
});

export const allNotificationIds = atom<string[]>({
  key: 'allNotificationIds',
  default: [],
});

export const unreadNotificationsForApp = selectorFamily<number, string>({
  key: 'unreadNotificationsForApp',
  get:
    (param) =>
    ({ get }) => {
      const allNotiIds = get(allNotificationIds);

      const unreadNotiIds = allNotiIds
        .map((id) => get(storedNotificationsFamily(id)))
        .filter((noti) => !noti.isRead && noti.appId === param);

      return unreadNotiIds.length;
    },
});

export const notificationsForApp = selectorFamily<NPWDNotification[], string>({
  key: 'notificationsForApp',
  get:
    (param) =>
    ({ get }) => {
      const allNotiIds = get(allNotificationIds);

      const notiIds = allNotiIds
        .map((id) => get(storedNotificationsFamily(id)))
        .filter((noti) => noti.appId === param);

      return notiIds;
    },
});

export const useUnreadNotiForApp = (appId: string) =>
  useRecoilValue(unreadNotificationsForApp(appId));

export const useNotificationsForApp = (appId: string) => useRecoilValue(notificationsForApp(appId));
