import {
  messageState,
  useActiveMessageConversation,
  useSetMessageConversations,
  useSetMessages,
} from './state';
import { useCallback } from 'react';
import { useLocation } from 'react-router';
import { useMessageNotifications } from './useMessageNotifications';
import { Message, PreDBMessage } from '../../../../../typings/messages';
import { useRecoilValue, useRecoilValueLoadable, waitForAll } from 'recoil';

interface MessageActionProps {
  removeConversation: (conversationId: string) => void;
  handleBroadcast: ({ conversationName, conversationId, message }) => void;
  updateMessages: (messageDto: Message) => void;
}

export const useMessageActions = (): MessageActionProps => {
  const { state: messageLoading } = useRecoilValueLoadable(messageState.messages);
  const { state: conversationLoading, contents } = useRecoilValueLoadable(
    messageState.messageCoversations,
  );

  const setMessageConversation = useSetMessageConversations();
  const activeMessageGroup = useActiveMessageConversation();
  const { pathname } = useLocation();
  const { setNotification } = useMessageNotifications();
  const setMessages = useSetMessages();

  const removeConversation = useCallback(
    (conversationId: string) => {
      if (conversationLoading !== 'hasValue') return;

      if (!contents.length) return;

      setMessageConversation((curVal) =>
        [...curVal].filter((conversation) => conversation.conversation_id !== conversationId),
      );
    },
    [setMessageConversation, conversationLoading, contents],
  );

  const handleBroadcast = useCallback(
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

  const updateMessages = useCallback(
    (messageDto: Message) => {
      if (messageLoading !== 'hasValue') return;

      setMessages((currVal) => [
        ...currVal,
        {
          message: messageDto.message,
          conversation_id: messageDto.conversation_id,
          author: messageDto.author,
          id: 1, // Obviously mock
        },
      ]);
    },
    [messageLoading, setMessages],
  );

  return {
    removeConversation,
    handleBroadcast,
    updateMessages,
  };
};
