import { useTranslation } from 'react-i18next';
import { matchPath, useHistory } from 'react-router-dom';
import { useApp } from '@os/apps/hooks/useApps';
import { useNotifications } from '@os/notifications/hooks/useNotifications';
import useMessages from './useMessages';
import { useRecoilValue } from 'recoil';
import { messageState } from './state';
import { fetchNui } from '../../../utils/fetchNui';
import { ServerPromiseResp } from '@typings/common';
import { MessageConversation, MessageConversationResponse, MessageEvents } from '@typings/messages';
import { useSnackbar } from '@os/snackbar/hooks/useSnackbar';
import { useMessageActions } from './useMessageActions';
import { useContactActions } from '../../contacts/hooks/useContactActions';

const NOTIFICATION_ID = 'messages:broadcast';

export const useMessageNotifications = () => {
  const [t] = useTranslation();
  const history = useHistory();
  const { removeId, addNotification, addNotificationAlert } = useNotifications();
  const { icon, notificationIcon } = useApp('MESSAGES');
  const { getMessageConversationById, goToConversation } = useMessages();
  const { updateConversations } = useMessageActions();
  const { getDisplayByNumber, getPictureByNumber } = useContactActions();
  const activeMessageConversation = useRecoilValue(messageState.activeMessageConversation);
  const { addAlert } = useSnackbar();

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

  const setNotification = ({ conversationName, conversationId, message }) => {
    let group: MessageConversation = null;

    group = getMessageConversationById(conversationId);

    if (!group) {
      fetchNui<ServerPromiseResp<MessageConversationResponse>>(
        MessageEvents.CREATE_MESSAGE_CONVERSATION,
        { targetNumber: conversationName },
      ).then((resp) => {
        if (resp.status !== 'ok') {
          return addAlert({
            message: t('MESSAGES.FEEDBACK.MESSAGE_GROUP_CREATE_FAILED'),
            type: 'error',
          });
        }

        const display = getDisplayByNumber(resp.data.phoneNumber);
        const avatar = getPictureByNumber(resp.data.phoneNumber);

        updateConversations({
          conversation_id: resp.data.conversation_id,
          phoneNumber: resp.data.phoneNumber,
          display: display,
          avatar: avatar,
          unread: 0,
        });
      });

      group = getMessageConversationById(conversationId);
    }

    const id = `${NOTIFICATION_ID}:${conversationId}`;

    const notification = {
      app: 'MESSAGES',
      id,
      sound: true,
      title: group?.display || group.phoneNumber || conversationName,
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
          title: group.phoneNumber || group?.display,
          content: t('MESSAGES.MESSAGES.UNREAD_MESSAGES', {
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
