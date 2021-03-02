import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { useApp } from '../../../os/apps/hooks/useApps';
import { useNotifications } from '../../../os/notifications/hooks/useNotifications';
import { goToConversation } from '../utils/goToConversation';
import { messageState } from './state';
import useMessages from './useMessages';

export const useMessageNotifications = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const { addNotificationAlert } = useNotifications();
  const { icon, notificationIcon } = useApp('MESSAGES');
  const [unreadCount, setUnreadCount] = useRecoilState(
    messageState.unreadMessagesCount
  );
  const { getMessageGroupById } = useMessages()

  const setNotification = useCallback(
    ({ groupId, message }) => {
      const group = getMessageGroupById(groupId);
      if (!group) return;

      setUnreadCount((curr: number) => {
        const unread = curr + 1;

        addNotificationAlert(
          {
            app: 'MESSAGES',
            title: t('APPS_MESSAGES_NEW_BROADCAST', { group: group.label || group.groupDisplay }),
            onClick: () => goToConversation(group ,history),
            content: message,
            icon,
            notificationIcon,
          },
          true,
          {
            title: t('APPS_MESSAGES_UNREAD_MESSAGES', { count: unread }),
            content: null,
          }
        );
        return unread;
      });
    },
    [setUnreadCount, addNotificationAlert, t, icon, notificationIcon, history]
  );

  return { setNotification, setUnreadCount, unreadCount };
};
