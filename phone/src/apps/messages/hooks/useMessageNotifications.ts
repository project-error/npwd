import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { useApp } from '../../../os/apps/hooks/useApps';
import { useNotifications } from '../../../os/notifications/hooks/useNotifications';
import { goToConversation } from '../utils/goToConversation';
import useMessages from './useMessages';

const NOTIFICATION_ID = 'messages:broadcast';

export const useMessageNotifications = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const {
    removeId,
    addNotification,
    addNotificationAlert,
  } = useNotifications();
  const { icon, notificationIcon } = useApp('MESSAGES');
  const { getMessageGroupById } = useMessages();

  const setNotification = ({ groupId, message }) => {
    const group = getMessageGroupById(groupId);
    if (!group) return;

    const id = `${NOTIFICATION_ID}:${groupId}`;

    const notification = {
      app: 'MESSAGES',
      id,
      sound: true,
      title: group.label || group.groupDisplay,
      onClick: () => goToConversation(group, history),
      content: message,
      icon,
      notificationIcon,
    };

    addNotificationAlert(notification, (n) => {
      removeId(id);
      if (group.unreadCount > 1) {
        addNotification({
          ...n,
          title: group.label || group.groupDisplay,
          content: t('APPS_MESSAGES_UNREAD_MESSAGES', {
            count: group.unreadCount,
          }),
        });
        return;
      }
      addNotification(n);
    });
  };

  return { setNotification };
};
