import { useRecoilCallback, useRecoilValue } from 'recoil';
import {
  activeNotificationsIds,
  allNotificationIds,
  storedNotificationsFamily,
  unreadNotifications,
} from '../state/notifications.state';
import { useApps } from '@os/apps/hooks/useApps';
import React, { useState } from 'react';
import { NotificationBase } from '../components/NotificationBase';
import { useSnackbar } from 'notistack';
import { css } from '@emotion/css';
import notiActiveExitHandler from '../utils/notiActiveExitHandler';
import useSound from '@os/sound/hooks/useSound';
import { useSettingsValue } from '../../../apps/settings/hooks/useSettings';
import { IApp } from '@os/apps/config/apps';
import { getSoundSettings } from '@os/sound/utils/getSoundSettings';
import { QueueNotificationOptsReadonly, UseNotificationVal } from '@typings/notifications';

const styles = {
  root: css({
    background: 'rgba(38,38,38,0.85) !important',
    borderRadius: '12px !important',
    boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
    backdropFilter: 'blur(4px)',
  }),
};

export const useNotifications = (): UseNotificationVal => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [soundSettings, setSoundSettings] = useState({
    sound: 'media/notifications/online.ogg',
    volume: 0,
  });

  const settings = useSettingsValue();
  const { play, playing } = useSound(soundSettings.sound, {
    loop: false,
    volume: soundSettings.volume,
  });

  const activeNotifications = useRecoilValue(activeNotificationsIds);
  const allUnreadNotifications = useRecoilValue(unreadNotifications);

  const setupSoundForNotification = (app: IApp) => {
    const { sound, volume } = getSoundSettings('notiSound', settings, app.id);
    setSoundSettings({ sound, volume });
    if (!playing) {
      play();
    }
  };

  const { getApp } = useApps();

  const createNotification = useRecoilCallback(
    ({ set, snapshot }) =>
      async ({
        appId,
        message,
        persist,
        uniqId,
        duration,
        path,
      }: QueueNotificationOptsReadonly) => {
        const app = getApp(appId);

        if (!app) throw new Error(`App with appId "${appId}" doesn't exist!`);

        const addedDate = new Date();

        set(storedNotificationsFamily(uniqId), {
          appId: app.id,
          message,
          timeReceived: addedDate,
          isActive: true,
          isRead: false,
          persist,
          uniqId,
          duration,
          path,
        });

        setupSoundForNotification(app);
        set(allNotificationIds, (curIds) => [...curIds, uniqId]);
        set(activeNotificationsIds, (curIds) => [...curIds, uniqId]);

        set(unreadNotifications, (curUnread) => [
          ...curUnread,
          {
            uniqId,
            appId: app.id,
            icon: app.icon,
            notificationIcon: app.notificationIcon,
            message,
            path: path,
          },
        ]);

        enqueueSnackbar(
          <NotificationBase
            uniqId={uniqId}
            app={app}
            message={message}
            timeReceived={addedDate}
            path={path}
          />,
          {
            autoHideDuration: duration,
            onExit: notiActiveExitHandler,
            key: uniqId,
            anchorOrigin: {
              horizontal: 'center',
              vertical: 'top',
            },
            className: styles.root,
          },
        );
      },
    [getApp],
  );

  const removeAllActive = useRecoilCallback(
    ({ reset, snapshot, set }) =>
      async () => {
        const allActiveIds = await snapshot.getPromise(activeNotificationsIds);

        for (const id of allActiveIds) {
          const noti = await snapshot.getPromise(storedNotificationsFamily(id));

          if (!noti) continue;

          set(storedNotificationsFamily(id), {
            ...noti,
            isActive: false,
          });
        }

        reset(activeNotificationsIds);
      },
    [],
  );

  const removeActive = useRecoilCallback(
    ({ set, snapshot }) =>
      async (id: string) => {
        closeSnackbar(id);

        const activeIds = await snapshot.getPromise(activeNotificationsIds);
        const tgtAtom = storedNotificationsFamily(id);
        const notiTgt = await snapshot.getPromise(tgtAtom);

        if (!notiTgt) return;

        set(tgtAtom, {
          ...notiTgt,
          isActive: false,
        });

        // Without the target
        const newActiveIds = activeIds.filter((curId) => curId !== id);

        set(activeNotificationsIds, newActiveIds);
      },
    [closeSnackbar],
  );

  const markAsRead =
    // Ignoring the recoil setter as its stable
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useRecoilCallback(
      ({ set, snapshot }) =>
        async (key: string) => {
          console.log(key);
          const tgtState = storedNotificationsFamily(key);
          const { isActive, isRead, ...restNoti } = await snapshot.getPromise(tgtState);

          set(tgtState, {
            ...restNoti,
            isRead: true,
            isActive: false,
          });

          // If the targeted notification isn't currently active, we should bail.
          if (isActive) {
            closeSnackbar(key);
            const curActiveNotis = await snapshot.getPromise(activeNotificationsIds);

            const newActiveNotis = curActiveNotis.filter((id) => id !== key);
            set(activeNotificationsIds, newActiveNotis);
          }

          const curUnreadNotis = await snapshot.getPromise(unreadNotifications);

          const newUnreadNotis = curUnreadNotis.filter((noti) => noti.uniqId !== key);
          set(unreadNotifications, newUnreadNotis);
        },
      [closeSnackbar],
    );

  const clearAllNotifications = useRecoilCallback(({ reset, snapshot }) => async () => {
    const allActiveNotis = await snapshot.getPromise(activeNotificationsIds);

    // In case we still have one open, we want to clear everything prior to reset.
    for (const id of allActiveNotis) {
      const tgtAtom = storedNotificationsFamily(id);
      const noti = await snapshot.getPromise(tgtAtom);

      if (noti.isActive) {
        closeSnackbar(id);
      }

      // Reset the notification atom
      reset(tgtAtom);
    }

    reset(activeNotificationsIds);
    reset(allNotificationIds);
  });

  return {
    clearAllNotifications,
    createNotification,
    removeAllActive,
    removeActive,
    activeNotifications,
    markAsRead,
    allUnreadNotifications,
  };
};
