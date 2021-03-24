import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { matchPath, useHistory } from 'react-router-dom';
import { useApp } from '../../../os/apps/hooks/useApps';
import { useNotifications } from '../../../os/notifications/hooks/useNotifications';
import { goToConversation } from '../utils/goToConversation';
import useMessages from './useMessages';

const NOTIFICATION_ID = 'messages:broadcast';

export const useMessageNotifications = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const { removeId, addNotification, addNotificationAlert } = useNotifications();
  const { icon, notificationIcon } = useApp('MESSAGES');
  const { getMessageGroupById, activeMessageGroup } = useMessages();

  // Remove notifications from groups when opening them
  history.listen((location) => {
    if (
      activeMessageGroup?.groupId &&
      matchPath(location.pathname, {
        path: `/messages/conversations/${activeMessageGroup.groupId}`,
        exact: true,
      })
    ) {
      removeId(`${NOTIFICATION_ID}:${activeMessageGroup.groupId}`);
    }
  });

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
