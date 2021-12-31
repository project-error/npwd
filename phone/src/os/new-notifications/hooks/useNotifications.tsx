import { useRecoilCallback } from 'recoil';
import {
  activeNotificationsIds,
  allNotificationIds,
  storedNotificationsFamily,
  unreadNotificationIds,
} from '../state/notifications.state';
import { useApps } from '@os/apps/hooks/useApps';
import React, { FC, useCallback, useState } from 'react';
import { NotificationBaseComponent } from '../components/NotificationBase';
import { useSnackbar } from 'notistack';
import notiActiveExitHandler from '../utils/notiActiveExitHandler';
import useSound from '@os/sound/hooks/useSound';
import { useSettingsValue } from '../../../apps/settings/hooks/useSettings';
import { IApp } from '@os/apps/config/apps';
import { getSoundSettings } from '@os/sound/utils/getSoundSettings';
import { QueueNotificationOptsReadonly, UseNotificationVal } from '@typings/notifications';

type VariantMap = {
  npwdNotification: NotificationBaseComponent;
};

export const useNotifications = (): UseNotificationVal => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar<VariantMap>();
  const [soundSettings, setSoundSettings] = useState({
    sound: 'media/notifications/online.ogg',
    volume: 0,
  });

  const settings = useSettingsValue();
  const { play, playing } = useSound(soundSettings.sound, {
    loop: false,
    volume: soundSettings.volume,
  });

  const setupSoundForNotification = useCallback(
    (app: IApp) => {
      const { sound, volume } = getSoundSettings('notiSound', settings, app.id);
      setSoundSettings({ sound, volume });
      if (!playing) {
        play();
      }
    },
    [settings, playing, play],
  );

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

        const curNotifications = await snapshot.getPromise(allNotificationIds);

        if (curNotifications.includes(uniqId)) {
          console.error(`Notification with uniqId "${uniqId}" already exists!`);
          return;
        }

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

        const timeReceived = new Date();

        setupSoundForNotification(app);

        set(allNotificationIds, (curIds) => [...curIds, uniqId]);
        set(activeNotificationsIds, (curIds) => [...curIds, uniqId]);
        set(unreadNotificationIds, (curIds) => [...curIds, uniqId]);

        set(storedNotificationsFamily(uniqId), {
          appId,
          path,
          uniqId,
          duration,
          isActive: true,
          isRead: false,
          persist,
          message,
          timeReceived,
        });

        enqueueSnackbar(message, {
          variant: 'npwdNotification',
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'center',
          },
          disableWindowBlurListener: true,
          autoHideDuration: 3000 || duration,
          onExit: (_, reason) => console.log(reason, _),
          key: uniqId,
          timeReceived,
          uniqId,
          path,
          app,
        });
      },
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

          const curUnreadNotis = await snapshot.getPromise(unreadNotificationIds);

          const newUnreadNotis = curUnreadNotis.filter((id) => id !== key);
          set(unreadNotificationIds, newUnreadNotis);
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
    markAsRead,
  };
};
