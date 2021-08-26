import { useActiveMessageConversation, useSetMessages } from './state';
import { useNuiEvent } from 'fivem-nui-react-lib';
import { useMessageNotifications } from './useMessageNotifications';
import { useCallback } from 'react';
import { useLocation } from 'react-router';
import { MessageEvents, PreDBMessage } from '../../../../../typings/messages';

export const useMessagesService = () => {
  const { pathname } = useLocation();
  const activeMessageGroup = useActiveMessageConversation();
  const setMessages = useSetMessages();

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

  // This is only called for the receiver of the message. We'll be using the standardized pattern for the transmitter.
  const handleUpdateMessages = (messageDto: PreDBMessage) => {
    setMessages((currVal) => [
      ...currVal,
      {
        message: messageDto.message,
        conversation_id: messageDto.conversationId,
        author: 'chip', // Obviously mock
        id: 1, // Obviously mock
      },
    ]);
  };

  useNuiEvent('MESSAGES', MessageEvents.CREATE_MESSAGE_BROADCAST, handleMessageBroadcast);
  useNuiEvent('MESSAGES', MessageEvents.SEND_MESSAGE_SUCCESS, handleUpdateMessages);
};
