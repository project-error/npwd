import { messageState, useSetMessageConversations, useSetMessages } from './state';
import { useCallback } from 'react';
import { Message, MessageConversation } from '@typings/messages';
import { useRecoilValueLoadable } from 'recoil';

interface MessageActionProps {
  updateLocalConversations: (conversation: MessageConversation) => void;
  removeLocalConversation: (conversationId: string[]) => void;
  updateLocalMessages: (messageDto: Message) => void;
  deleteLocalMessage: (messageId: number) => void;
  setMessageReadState: (conversationId: string, unreadCount: number) => void;
}

export const useMessageActions = (): MessageActionProps => {
  const { state: messageLoading } = useRecoilValueLoadable(messageState.messages);
  const { state: conversationLoading, contents: conversations } = useRecoilValueLoadable(
    messageState.messageCoversations,
  );
  const setMessageConversation = useSetMessageConversations();
  const setMessages = useSetMessages();

  const updateLocalConversations = useCallback(
    (conversation: MessageConversation) => {
      setMessageConversation((curVal) => [conversation, ...curVal]);
    },
    [setMessageConversation],
  );

  const setMessageReadState = useCallback(
    (conversationId: string, unreadCount: number) => {
      setMessageConversation((curVal) =>
        curVal.map((message: MessageConversation) => {
          if (message.conversation_id === conversationId) {
            return {
              ...message,
              unread: unreadCount,
            };
          }

          return message;
        }),
      );
    },
    [setMessageConversation],
  );

  const removeLocalConversation = useCallback(
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

  const updateLocalMessages = useCallback(
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

  const deleteLocalMessage = useCallback(
    (messageId: number) => {
      setMessages((currVal) => [...currVal].filter((msg) => msg.id !== messageId));
    },
    [setMessages],
  );

  return {
    updateLocalConversations,
    removeLocalConversation,
    updateLocalMessages,
    deleteLocalMessage,
    setMessageReadState,
  };
};
