import { useRecoilState, useRecoilValue } from 'recoil';
import {
  activeNotifications,
  notificationState,
  NotiMap,
  NPWDNotification,
} from '../state/notifcations.state';
import { useApps } from '../../apps/hooks/useApps';
import React, { useCallback } from 'react';
import { NotificationBase } from '../components/NotificationBase';
import { useSnackbar } from 'notistack';
import { css } from '@emotion/css';
import lodashDeepClone from 'lodash/cloneDeep';
import notiActiveExitHandler from '../utils/notiActiveExitHandler';

export interface QueueNotificationOpts {
  appId: string;
  duration?: number;
  message: React.ReactNode | string;
  persist?: boolean;
  uniqId?: string;
}

interface UseNotificationVal {
  activeNotis: NotiMap;
  allNotis: NotiMap;
  queueNotification: (opts: QueueNotificationOpts) => void;
  removeAllActive: () => void;
  removeActive: (key: string | number) => void;
  markAsRead: (key: string | number) => void;
}

const styles = {
  root: css({
    background: 'rgba(38,38,38,0.85) !important',
    borderRadius: '12px !important',
    boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
    backdropFilter: 'blur(4px)',
  }),
};

export const useNotifications = (): UseNotificationVal => {
  const [notis, setNotis] = useRecoilState(notificationState);
  const activeNotis = useRecoilValue(activeNotifications);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const { getApp } = useApps();

  const queueNotification = useCallback(
    ({ appId, message, persist, uniqId, duration }: QueueNotificationOpts) => {
      const app = getApp(appId);

      if (!app) throw new Error(`App with appId "${appId}" doesn't exist!`);

      const id = enqueueSnackbar(<NotificationBase app={app} message={message} />, {
        autoHideDuration: duration,
        onExit: notiActiveExitHandler,
        key: uniqId,
        anchorOrigin: {
          horizontal: 'center',
          vertical: 'top',
        },
        className: styles.root,
      });

      setNotis((curNotis) => {
        if (curNotis[id])
          throw new Error(`Notification with uniqId of "${uniqId}" already exists!`);

        // Need to clone for immutability sake
        const notisCloned: NotiMap = lodashDeepClone(curNotis);

        // noinspection UnnecessaryLocalVariableJS
        const newNotiObj: NPWDNotification = {
          message,
          persist,
          duration,
          key: id,
          isRead: false,
          isActive: true,
          appId,
        };
        // Assign and set our initial notification state
        notisCloned[id] = newNotiObj;

        return notisCloned;
      });

      return id;
    },
    // Ignore curNotis in deps as its considered stable.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [enqueueSnackbar, getApp],
  );

  const removeAllActive = useCallback(() => {
    closeSnackbar();
    setNotis((curNotis) => {
      const copiedMap: NotiMap = lodashDeepClone(curNotis);

      for (const [key, value] of Object.entries(copiedMap)) {
        if (value?.isActive) {
          copiedMap[key] = { ...value, isActive: false };
        }
      }

      return copiedMap;
    });
  }, [closeSnackbar, setNotis]);

  const removeActive = useCallback(
    (key: string | number) => {
      closeSnackbar(key);
      // If the targeted notification isn't currently active, we should bail.
      if (!activeNotis[key]) return;

      setNotis((curNotis) => {
        const mapCopy = lodashDeepClone(curNotis);
        const tgtNoti = mapCopy[key];

        tgtNoti.isActive = false;

        return mapCopy;
      });
    },
    [closeSnackbar, activeNotis, setNotis],
  );

  const markAsRead = useCallback(
    (key: string | number) => {
      setNotis((curNotis) => {
        const tgtNoti = curNotis[key];
        if (!tgtNoti) throw new Error(`Noti with key "${key}" wasn't found`);

        const updatedCopy: NPWDNotification = { ...tgtNoti, isRead: true };

        const copyMap = lodashDeepClone(updatedCopy);

        // In case the notification is currently on screen while marked as read
        // we want to clear active status if so.
        if (tgtNoti.isActive) {
          tgtNoti.isActive = false;
          closeSnackbar(key);
        }

        return copyMap;
      });
    },
    // Ignoring the recoil setter as its stable
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [closeSnackbar],
  );

  return {
    queueNotification,
    removeAllActive,
    removeActive,
    markAsRead,
    allNotis: notis,
    activeNotis,
  };
};
