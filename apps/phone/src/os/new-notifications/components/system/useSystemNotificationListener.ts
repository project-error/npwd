import { activeNotificationIds, allNotificationIds } from '@os/new-notifications/state';
import { NotificationEvents, SystemNotificationDTO } from '@typings/notifications';
import { useNuiEvent } from 'fivem-nui-react-lib';
import { useSnackbar } from 'notistack';
import { useAtomValue, useSetAtom } from 'jotai';
import { useCallback } from 'react';
import uuid from 'react-uuid';
import { useNotification } from '@os/new-notifications/useNotification';

export const useSystemNotificationListener = () => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { removeActive } = useNotification();
  const allIds = useAtomValue(allNotificationIds);
  const setActiveIds = useSetAtom(activeNotificationIds);

  const createNotification = useCallback(
    (dto: SystemNotificationDTO) => {
      const uniqID = `${dto.uniqId}:${uuid()}`;

      if (allIds.includes(uniqID)) {
        console.error(`Notification with key: [${uniqID}] already exists!`);
        return;
      }

      // This makes the phone pop up while notistack owns the system notification UI.
      setActiveIds((curIds: string[]) => [...curIds, uniqID]);

      enqueueSnackbar(dto.content, {
        variant: 'npwdSystemNotification',
        secondaryTitle: dto.secondaryTitle,
        key: dto.uniqId,
        persist: dto.keepOpen || false,
        autoHideDuration: dto.duration || 3000,
        controls: dto.controls ?? false,
        onExited: () => {
          removeActive(uniqID);
        },
      });
    },
    [allIds, enqueueSnackbar, removeActive, setActiveIds],
  );

  const removeSystemNotification = ({ uniqId }) => {
    closeSnackbar(uniqId);
  };

  useNuiEvent('SYSTEM', NotificationEvents.CREATE_SYSTEM_NOTIFICATION, createNotification);
  useNuiEvent('SYSTEM', NotificationEvents.REMOVE_SYSTEM_NOTIFICATION, removeSystemNotification);
};
