import { messageState, useSetMessageConversations, useSetMessages } from './state';
import { useCallback } from 'react';
import { Message } from '../../../../../typings/messages';
import { useRecoilValueLoadable } from 'recoil';

interface MessageActionProps {
  removeConversation: (conversationId: string) => void;
  updateMessages: (messageDto: Message) => void;
}

export const useMessageActions = (): MessageActionProps => {
  const { state: messageLoading } = useRecoilValueLoadable(messageState.messages);
  const { state: conversationLoading, contents } = useRecoilValueLoadable(
    messageState.messageCoversations,
  );

  const setMessageConversation = useSetMessageConversations();
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
    updateMessages,
  };
};
