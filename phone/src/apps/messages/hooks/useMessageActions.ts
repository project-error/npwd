import { messageState, useSetMessageConversations, useSetMessages } from './state';
import { useCallback } from 'react';
import { Message, MessageConversation } from '../../../../../typings/messages';
import { useRecoilValueLoadable } from 'recoil';

interface MessageActionProps {
  updateConversations: (conversation: MessageConversation) => void;
  removeConversation: (conversationId: string[]) => void;
  updateMessages: (messageDto: Message) => void;
  deleteMessage: (messageId: number) => void;
}

export const useMessageActions = (): MessageActionProps => {
  const { state: messageLoading } = useRecoilValueLoadable(messageState.messages);
  const { state: conversationLoading, contents: conversations } = useRecoilValueLoadable(
    messageState.messageCoversations,
  );

  const setMessageConversation = useSetMessageConversations();
  const setMessages = useSetMessages();

  const updateConversations = useCallback(
    (conversation: MessageConversation) => {
      setMessageConversation((curVal) => [conversation, ...curVal]);
    },
    [setMessageConversation],
  );

  const removeConversation = useCallback(
    (conversationsId: string[]) => {
      if (conversationLoading !== 'hasValue') return;

      if (!conversations.length) return;

      setMessageConversation((curVal) =>
        [...curVal].filter(
          (conversation) => !conversationsId.includes(conversation.conversation_id),
        ),
      );
    },
    [setMessageConversation, conversationLoading, conversations],
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
          id: messageDto.id,
        },
      ]);
    },
    [messageLoading, setMessages],
  );

  const deleteMessage = useCallback(
    (messageId: number) => {
      setMessages((currVal) => [...currVal].filter((msg) => msg.id !== messageId));
    },
    [setMessages],
  );

  return {
    updateConversations,
    removeConversation,
    updateMessages,
    deleteMessage,
  };
};
