import { useActiveMessageConversation } from './state';
import { useNuiEvent } from 'fivem-nui-react-lib';
import { useMessageNotifications } from './useMessageNotifications';
import { useCallback } from 'react';
import { useLocation } from 'react-router';
import { MessageEvents } from '../../../../../typings/messages';

export const useMessagesService = () => {
  const { pathname } = useLocation();
  const activeMessageGroup = useActiveMessageConversation();

  const { setNotification } = useMessageNotifications();

  const handleMessageBroadcast = useCallback(
    ({ groupId, message }) => {
      if (groupId === activeMessageGroup?.conversation_id) {
        if (pathname.includes('messages/conversations')) {
          // Dont trigger notification if conversation is open.
          return;
        }
      }
      setNotification({ groupId, message });
    },
    [activeMessageGroup, pathname, setNotification],
  );

  useNuiEvent('MESSAGES', MessageEvents.CREATE_MESSAGE_BROADCAST, handleMessageBroadcast);
};
