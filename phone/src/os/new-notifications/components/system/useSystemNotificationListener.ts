import { NotificationEvents, SystemNotificationDTO } from '@typings/notifications';
import { useNuiEvent } from 'fivem-nui-react-lib';
import { useSnackbar } from 'notistack';

export const useSystemNotificationListener = () => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const createNotification = (dto: SystemNotificationDTO) => {
    enqueueSnackbar(dto.content, {
      variant: 'npwdSystemNotification',
      secondaryTitle: dto.secondaryTitle,
      key: dto.uniqId,
      persist: dto.keepOpen || false,
      autoHideDuration: dto.duration || 3000,
      controls: dto.controls ?? false,
    });
  };

  const removeSystemNotification = ({ uniqId }) => {
    closeSnackbar(uniqId);
  };

  useNuiEvent('SYSTEM', NotificationEvents.CREATE_SYSTEM_NOTIFICATION, createNotification);
  useNuiEvent('SYSTEM', NotificationEvents.REMOVE_SYSTEM_NOTIFICATION, removeSystemNotification);
};
