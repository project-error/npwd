import { useNuiEvent } from 'fivem-nui-react-lib';
import { Message, MessageEvents } from '../../../../../typings/messages';
import { useMessageActions } from './useMessageActions';
import { useCallback } from 'react';
import { useMessageNotifications } from './useMessageNotifications';
import { useActiveMessageConversation } from './state';
import { useLocation } from 'react-router';

export const useMessagesService = () => {
  const { updateMessages } = useMessageActions();
  const { setNotification } = useMessageNotifications();
  const activeMessageGroup = useActiveMessageConversation();
  const { pathname } = useLocation();

  /* const handleMessageBroadcast = useCallback(
    ({ conversationName, conversationId, message }) => {
      handleBroadcast({ conversationName, conversationId, message });
    },
    [handleBroadcast],
  ); */

  const handleMessageBroadcast = useCallback(
    ({ conversationName, conversationId, message }) => {
      if (conversationId === activeMessageGroup.conversation_id) {
        if (pathname.includes('messages/conversations')) {
          return;
        }
      }

      setNotification({ conversationId, message });
    },
    [setNotification, activeMessageGroup, pathname],
  );

  // This is only called for the receiver of the message. We'll be using the standardized pattern for the transmitter.
  const handleUpdateMessages = useCallback(
    (messageDto: Message) => {
      updateMessages(messageDto);
    },
    [updateMessages],
  );

  useNuiEvent('MESSAGES', MessageEvents.CREATE_MESSAGE_BROADCAST, handleMessageBroadcast);
  useNuiEvent('MESSAGES', MessageEvents.SEND_MESSAGE_SUCCESS, handleUpdateMessages);
};
