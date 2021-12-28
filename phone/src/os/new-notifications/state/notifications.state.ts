import { atom, atomFamily, selector, selectorFamily, useRecoilValue } from 'recoil';
import { QueueNotificationOptsReadonly } from '../hooks/useNotifications';
import lodashIsEmpty from 'lodash/isEmpty';

export interface NPWDNotification extends QueueNotificationOptsReadonly {
  isActive: boolean;
  isRead: boolean;
  timeReceived: Date;
}

export type NotiMap = Record<string | number, NPWDNotification>;

export const notificationState = atom<NotiMap>({
  key: 'notiState',
  default: {},
});

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

export const activeNotifications = selector<NotiMap | null>({
  key: 'activeNotiState',
  get: ({ get }) => {
    const notis = get(notificationState);

    const foundActive = {};

    for (const [key, value] of Object.entries(notis)) {
      if (value.isActive) {
        foundActive[key] = { ...value };
      }
    }

    return lodashIsEmpty(foundActive) ? null : foundActive;
  },
});

export const useUnreadNotiForApp = (appId: string) =>
  useRecoilValue(unreadNotificationsForApp(appId));
