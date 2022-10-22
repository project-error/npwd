import { useSnackbar } from 'notistack';
import { useRecoilCallback } from 'recoil';
import { useApps } from '../apps/hooks/useApps';
import uuid from 'react-uuid';

import {
  notifications,
  allNotificationIds,
  activeNotificationIds,
  unreadNotificationIds,
  unreadNotifications,
} from './state';

interface NotificationProps {
  enqueueNotification: (options: any) => void;
  removeAllActive: () => void;
  removeActive: (id: string) => void;
  markAsRead: (key: string) => void;
  markAllAsRead: () => Promise<void>;
  clearAllNotifications: () => void;
}

export const useNotification = (): NotificationProps => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { getApp } = useApps();

  const enqueueNotification = useRecoilCallback(
    ({ set, snapshot }) =>
      async ({
        appId,
        content,
        secondaryTitle,
        notisId,
        path,
        keepOpen = false,
        onClick,
        duration,
      }: any) => {
        const app = getApp(appId);

        const curNotis = await snapshot.getPromise(allNotificationIds);
        const uniqID = `${notisId}:${uuid()}`;

        if (curNotis.includes(uniqID)) {
          console.error(`Notification with key: [${uniqID}] already exists!`);
          return;
        }

        set(notifications(uniqID), {
          appId: app.id,
          content,
          path,
          onClick,
          isRead: false,
          isActive: true,
          keepOpen,
          duration,
          id: uniqID,
        });

        set(allNotificationIds, (curIds: string[]) => [...curIds, uniqID]);
        set(activeNotificationIds, (curIds: string[]) => [...curIds, uniqID]);
        set(unreadNotificationIds, (curIds: string[]) => [...curIds, uniqID]);

        set(unreadNotifications, (curVal) => [
          ...curVal,
          {
            id: uniqID,
            appId,
            path: path,
          },
        ]);

        enqueueSnackbar(content, {
          variant: 'npwdNotification',
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'center',
          },
          persist: keepOpen,
          key: uniqID,
          onExited: () => {
            removeActive(uniqID);
          },
          onClick,
          secondaryTitle,
          path,
          app,
          autoHideDuration: 3000 || duration,
          disableWindowBlurListener: true,
        });
      },
  );

  const removeAllActive = useRecoilCallback(
    ({ reset, snapshot, set }) =>
      async () => {
        const allActiveIds = await snapshot.getPromise(activeNotificationIds);

        for (const id of allActiveIds) {
          const noti = await snapshot.getPromise(notifications(id));
          if (!noti) continue;

          set(notifications(id), {
            ...noti,
            isActive: false,
          });
        }

        reset(activeNotificationIds);
      },
    [],
  );

  const removeActive = useRecoilCallback(
    ({ set, snapshot }) =>
      async (id: string) => {
        closeSnackbar(id);

        const activeIds = await snapshot.getPromise(activeNotificationIds);
        const tgtAtom = notifications(id);
        const notiTgt = await snapshot.getPromise(tgtAtom);

        if (!notiTgt) return;

        set(tgtAtom, {
          ...notiTgt,
          isActive: false,
        });

        // Without the target
        const newActiveIds = activeIds.filter((curId) => curId !== id);

        set(activeNotificationIds, newActiveIds);
      },
    [closeSnackbar],
  );

  const markAsRead =
    // Ignoring the recoil setter as its stable
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useRecoilCallback(
      ({ set, snapshot }) =>
        async (key: string) => {
          const tgtState = notifications(key);
          const { isActive, isRead, ...restNoti } = await snapshot.getPromise(tgtState);

          set(tgtState, {
            ...restNoti,
            isRead: true,
            isActive: false,
          });

          // If the targeted notification isn't currently active, we should bail.
          if (isActive) {
            closeSnackbar(key);
            const curActiveNotis = await snapshot.getPromise(activeNotificationIds);

            const newActiveNotis = curActiveNotis.filter((id) => id !== key);
            set(activeNotificationIds, newActiveNotis);
          }

          const curUnreadNotisIds = await snapshot.getPromise(unreadNotificationIds);

          const newUnreadNotisIds = curUnreadNotisIds.filter((id) => id !== key);
          set(unreadNotificationIds, newUnreadNotisIds);

          const curUnreadNotis = await snapshot.getPromise(unreadNotifications);

          const newUnreadNotis = curUnreadNotis.filter((noti) => noti.id !== key);
          set(unreadNotifications, newUnreadNotis);
        },
      [closeSnackbar],
    );

  const markAllAsRead = useRecoilCallback(({ snapshot }) => async () => {
    const allNotis = await snapshot.getPromise(unreadNotificationIds);

    for (const id of allNotis) {
      await markAsRead(id);
    }
  });

  const clearAllNotifications = useRecoilCallback(({ reset, snapshot }) => async () => {
    const allNotis = await snapshot.getPromise(allNotificationIds);

    // In case we still have one open, we want to clear everything prior to reset.
    for (const id of allNotis) {
      const tgtAtom = notifications(id);
      const noti = await snapshot.getPromise(tgtAtom);

      if (noti.isActive) {
        closeSnackbar(id);
      }

      // Reset the notification atom
      reset(tgtAtom);
    }

    reset(unreadNotificationIds);
    reset(unreadNotifications);
    reset(activeNotificationIds);
    reset(allNotificationIds);
  });

  return {
    enqueueNotification,
    removeAllActive,
    removeActive,
    markAsRead,
    markAllAsRead,
    clearAllNotifications,
  };
};
