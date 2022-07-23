import { useNotifications } from '@os/notifications/hooks/useNotifications';
import { useNuiCallback, useNuiEvent } from 'fivem-nui-react-lib';
import { INotification } from '@os/notifications/providers/NotificationsProvider';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

const icons = {
  bank: <AccountBalanceIcon />,
};
interface IUniversalNotification {
  app: string;
  id?: string;
  title: string;
  content?: string;
  icon?: string;
  notificationIcon?: string;
  sound?: boolean;
  cantClose?: boolean;
  keepWhenPhoneClosed?: boolean;
  onClose?: () => void;
  onClick?: () => void;
  backgroundColor?: string;
  color?: string;
}

export const GlobalNotifier = function () {
  const { addNotificationAlert } = useNotifications();

  useNuiEvent('GLOBALNOTIFICATION', 'sendNotification', (data: IUniversalNotification) => {
    //title, content, sound
    const notification: INotification = {
      app: data.app ?? 'GLOBALNOTIFICATION',
      backgroundColor: '',
      cantClose: data.cantClose,
      color: '',
      content: data.content,
      icon: data.icon === undefined ? undefined : icons[data.icon] ?? undefined,
      id: '',
      keepWhenPhoneClosed: data.keepWhenPhoneClosed,
      notificationIcon: data.icon === undefined ? undefined : icons[data.icon] ?? undefined,
      onClick(notification: INotification): void {},
      onClose(notification: INotification): void {},
      sound: data.sound ?? false,
      title: data.title,
    };

    addNotificationAlert(notification);
  });
  return <div></div>;
};
