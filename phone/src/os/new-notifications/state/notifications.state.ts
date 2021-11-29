import { atom, selector } from 'recoil';
import { QueueNotificationOpts } from '../hooks/useNotifications';
import lodashIsEmpty from 'lodash/isEmpty';

export interface NPWDNotification extends QueueNotificationOpts {
  isActive: boolean;
  isRead: boolean;
  route?: boolean;
  timeReceived: Date;
  key: string | number;
}

export type NotiMap = Record<string | number, NPWDNotification>;

export const notificationState = atom<NotiMap>({
  key: 'notiState',
  default: {},
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
