import { useApps } from '@os/apps/hooks/useApps';
import { CreateNotificationDTO, NotificationEvents } from '@typings/notifications';
import { useNuiEvent } from 'fivem-nui-react-lib';
import { useNotification } from './useNotification';

export const useNotificationListener = () => {
  const { enqueueNotification } = useNotification();
  const { getApp } = useApps();

  const createNotification = (data: CreateNotificationDTO) => {
    const app = getApp(data.appId);

    enqueueNotification({
      appId: app.id,
      content: data.content,
      secondaryTitle: data.secondaryTitle,
      duration: data.duration,
      keepOpen: data.keepOpen,
      path: data.path,
      notisId: data.notisId,
      onClick: null,
    });
  };

  useNuiEvent('PHONE', NotificationEvents.CREATE_NOTIFICATION, createNotification);
};
