import { useSnackbar } from 'notistack';
import { useAtomValue, useSetAtom } from 'jotai';
import { useCallback } from 'react';
import { useApps } from '../apps/hooks/useApps';
import uuid from 'react-uuid';

import {
  allNotificationIds,
  activeNotificationIds,
  unreadNotificationIds,
  unreadNotifications,
  notificationsAtom,
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
  const notificationMap = useAtomValue(notificationsAtom);
  const allIds = useAtomValue(allNotificationIds);
  const activeIds = useAtomValue(activeNotificationIds);
  const unreadIds = useAtomValue(unreadNotificationIds);
  const setNotifications = useSetAtom(notificationsAtom);
  const setAllIds = useSetAtom(allNotificationIds);
  const setActiveIds = useSetAtom(activeNotificationIds);
  const setUnreadIds = useSetAtom(unreadNotificationIds);
  const setUnreadNotifications = useSetAtom(unreadNotifications);

  const removeActive = useCallback(
    (id: string) => {
      closeSnackbar(id);

      setNotifications((current) => {
        const notiTgt = current[id];
        if (!notiTgt) return current;

        return {
          ...current,
          [id]: {
            ...notiTgt,
            isActive: false,
          },
        };
      });

      setActiveIds((current) => current.filter((curId) => curId !== id));
    },
    [closeSnackbar, setActiveIds, setNotifications],
  );

  const enqueueNotification = useCallback(
    ({
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
      const uniqID = `${notisId}:${uuid()}`;

      if (allIds.includes(uniqID)) {
        console.error(`Notification with key: [${uniqID}] already exists!`);
        return;
      }

      setNotifications((current) => ({
        ...current,
        [uniqID]: {
          appId: app.id,
          content,
          path,
          onClick,
          isRead: false,
          isActive: true,
          keepOpen,
          duration,
          id: uniqID,
        },
      }));

      setAllIds((curIds) => [...curIds, uniqID]);
      setActiveIds((curIds) => [...curIds, uniqID]);
      setUnreadIds((curIds) => [...curIds, uniqID]);

      setUnreadNotifications((curVal) => [
        ...curVal,
        {
          id: uniqID,
          appId,
          path,
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
        autoHideDuration: duration || 3000,
        disableWindowBlurListener: true,
      });
    },
    [
      allIds,
      enqueueSnackbar,
      getApp,
      removeActive,
      setActiveIds,
      setAllIds,
      setNotifications,
      setUnreadIds,
      setUnreadNotifications,
    ],
  );

  const removeAllActive = useCallback(() => {
    setNotifications((current) => {
      const next = { ...current };

      for (const id of activeIds) {
        const noti = next[id];
        if (!noti) continue;

        next[id] = {
          ...noti,
          isActive: false,
        };
      }

      return next;
    });

    setActiveIds([]);
  }, [activeIds, setActiveIds, setNotifications]);

  const markAsRead = useCallback(
    async (key: string) => {
      const target = notificationMap[key];
      if (!target) return;

      setNotifications((current) => ({
        ...current,
        [key]: {
          ...current[key],
          isRead: true,
          isActive: false,
        },
      }));

      if (target.isActive) {
        closeSnackbar(key);
        setActiveIds((current) => current.filter((id) => id !== key));
      }

      setUnreadIds((current) => current.filter((id) => id !== key));
      setUnreadNotifications((current) => current.filter((noti) => noti.id !== key));
    },
    [
      closeSnackbar,
      notificationMap,
      setActiveIds,
      setNotifications,
      setUnreadIds,
      setUnreadNotifications,
    ],
  );

  const markAllAsRead = useCallback(async () => {
    for (const id of unreadIds) {
      await markAsRead(id);
    }
  }, [markAsRead, unreadIds]);

  const clearAllNotifications = useCallback(async () => {
    for (const id of allIds) {
      const noti = notificationMap[id];

      if (noti?.isActive) {
        closeSnackbar(id);
      }
    }

    setNotifications({});
    setUnreadIds([]);
    setUnreadNotifications([]);
    setActiveIds([]);
    setAllIds([]);
  }, [
    allIds,
    closeSnackbar,
    notificationMap,
    setActiveIds,
    setAllIds,
    setNotifications,
    setUnreadIds,
    setUnreadNotifications,
  ]);

  return {
    enqueueNotification,
    removeAllActive,
    removeActive,
    markAsRead,
    markAllAsRead,
    clearAllNotifications,
  };
};
