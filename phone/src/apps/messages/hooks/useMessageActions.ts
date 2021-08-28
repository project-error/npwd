import {
  messageState,
  useActiveMessageConversation,
  useSetMessageConversation,
  useSetMessages,
} from './state';
import { useCallback } from 'react';
import { useLocation } from 'react-router';
import { useMessageNotifications } from './useMessageNotifications';
import { PreDBMessage } from '../../../../../typings/messages';
import { useRecoilValueLoadable } from 'recoil';

interface MessageActionProps {
  removeConversation: (conversationId: string) => void;
  handleBroadcast: ({ conversationName, conversationId, message }) => void;
  updateMessages: (messageDto: PreDBMessage) => void;
}

export const useMessageActions = (): MessageActionProps => {
  const { state: messageLoading } = useRecoilValueLoadable(messageState.messages);
  const { state: conversationLoading, contents } = useRecoilValueLoadable(
    messageState.messageCoversations,
  );

  console.dir(contents);

  const setMessageConversation = useSetMessageConversation();
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
      if (conversationId === activeMessageGroup?.conversation_id) {
        if (pathname.includes('messages/conversations')) {
          return;
        }
      }

      setNotification({ conversationId, message });
    },
    [setNotification, activeMessageGroup, pathname],
  );

  const updateMessages = useCallback(
    (messageDto: PreDBMessage) => {
      if (messageLoading !== 'hasValue') return;

      setMessages((currVal) => [
        ...currVal,
        {
          message: messageDto.message,
          conversation_id: messageDto.conversationId,
          author: 'chip', // Obviously mock
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
