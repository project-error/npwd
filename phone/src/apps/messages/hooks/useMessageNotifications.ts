import { useTranslation } from 'react-i18next';
import { matchPath, useHistory } from 'react-router-dom';
import { useApp } from '../../../os/apps/hooks/useApps';
import { useNotifications } from '../../../os/notifications/hooks/useNotifications';
import useMessages from './useMessages';
import { useRecoilValue, waitForAll } from 'recoil';
import { messageState } from './state';

const NOTIFICATION_ID = 'messages:broadcast';

export const useMessageNotifications = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const { removeId, addNotification, addNotificationAlert } = useNotifications();
  const { icon, notificationIcon } = useApp('MESSAGES');
  const { getMessageConversationById, goToConversation } = useMessages();
  const activeMessageConversation = useRecoilValue(messageState.activeMessageConversation);

  // Remove notifications from groups when opening them
  history.listen((location) => {
    if (
      activeMessageConversation?.conversation_id &&
      matchPath(location.pathname, {
        path: `/messages/conversations/${activeMessageConversation.conversation_id}`,
        exact: true,
      })
    ) {
      removeId(`${NOTIFICATION_ID}:${activeMessageConversation.conversation_id}`);
    }
  });

  const setNotification = ({ conversationId, message }) => {
    const group = getMessageConversationById(conversationId);
    if (!group) return;

    const id = `${NOTIFICATION_ID}:${conversationId}`;

    const notification = {
      app: 'MESSAGES',
      id,
      sound: true,
      title: group.phoneNumber || group.display,
      onClick: () => goToConversation(group),
      content: message,
      icon,
      notificationIcon,
    };

    addNotificationAlert(notification, (n) => {
      removeId(id);
      if (group.unread > 1) {
        addNotification({
          ...n,
          title: group.phoneNumber || group.display,
          content: t('APPS_MESSAGES_UNREAD_MESSAGES', {
            count: group.unread,
          }),
        });
        return;
      }
      addNotification(n);
    });
  };

  return { setNotification };
};
