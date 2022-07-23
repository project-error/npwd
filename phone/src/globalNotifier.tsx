import { useNotifications } from '@os/notifications/hooks/useNotifications';
import { useNuiCallback, useNuiEvent } from 'fivem-nui-react-lib';
import { INotification } from '@os/notifications/providers/NotificationsProvider';

export const GlobalNotifier = function () {
  const { addNotificationAlert } = useNotifications();

  useNuiEvent('GLOBALNOTIFICATION', 'sendNotification', (data: INotification) => {
    //title, content, sound
    const notification: INotification = {
      app: data.app ?? 'GLOBALNOTIFICATION',
      backgroundColor: '',
      cantClose: data.cantClose,
      color: '',
      content: data.content,
      icon: undefined,
      id: '',
      keepWhenPhoneClosed: false,
      notificationIcon: undefined,
      onClick(notification: INotification): void {},
      onClose(notification: INotification): void {},
      sound: data.sound ?? false,
      title: data.title,
    };

    addNotificationAlert(notification);
  });
  return <div></div>;
};
