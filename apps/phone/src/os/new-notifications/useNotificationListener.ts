import { useApps } from '@os/apps/hooks/useApps';
import { useSubscription } from '@os/events/useCustomEvents';
import { CreateNotificationDTO, NotificationEvents } from '@typings/notifications';
import { useNuiEvent } from 'fivem-nui-react-lib';
import { useEffect } from 'react';
import { useNotification } from './useNotification';

export const useNotificationListener = () => {
  const { enqueueNotification } = useNotification();
  const { getApp } = useApps();

  const { unsubscribe } = useSubscription('npwd:ext:createNotification', (dto: any) => {
    createNotification(dto.detail);
  });

  useEffect(() => {
    return () => {
      unsubscribe();
    };
  });

  const createNotification = (data: CreateNotificationDTO) => {
    const app = getApp(data.appId);

    if (!app) {
      console.error(`Failed to create notification. The app with id ${data.appId} was not found!`);
      console.error(`Make sure you pass the correct appId when creating a notification.`);
      return;
    }

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
