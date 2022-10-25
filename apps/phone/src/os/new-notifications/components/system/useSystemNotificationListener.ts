import { activeNotificationIds, allNotificationIds } from '@os/new-notifications/state';
import { NotificationEvents, SystemNotificationDTO } from '@typings/notifications';
import { useNuiEvent } from 'fivem-nui-react-lib';
import { useSnackbar } from 'notistack';
import { useRecoilCallback } from 'recoil';
import uuid from 'react-uuid';
import { useNotification } from '@os/new-notifications/useNotification';

export const useSystemNotificationListener = () => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { removeActive } = useNotification();
  const createNotification = useRecoilCallback(
    ({ set, snapshot }) =>
      async (dto: SystemNotificationDTO) => {
        const curNotis = await snapshot.getPromise(allNotificationIds);
        const uniqID = `${dto.uniqId}:${uuid()}`;

        if (curNotis.includes(uniqID)) {
          console.error(`Notification with key: [${uniqID}] already exists!`);
          return;
        }

        // TODO: We might want add this to unread as well, hmm - not sure how
        // we want to do that with controls as well :/
        // This will atleast make the phone pop up
        set(activeNotificationIds, (curIds: string[]) => [...curIds, uniqID]);

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
    [],
  );

  const removeSystemNotification = ({ uniqId }) => {
    closeSnackbar(uniqId);
  };

  useNuiEvent('SYSTEM', NotificationEvents.CREATE_SYSTEM_NOTIFICATION, createNotification);
  useNuiEvent('SYSTEM', NotificationEvents.REMOVE_SYSTEM_NOTIFICATION, removeSystemNotification);
};
