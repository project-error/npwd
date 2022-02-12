import { messageState, useSetMessageConversations, useSetMessages } from './state';
import { useCallback } from 'react';
import { Message, MessageConversation } from '@typings/messages';
import { useRecoilValueLoadable } from 'recoil';
import { useContactActions } from '../../contacts/hooks/useContactActions';

interface MessageActionProps {
  updateLocalConversations: (conversation: MessageConversation) => void;
  removeLocalConversation: (conversationId: number[]) => void;
  updateLocalMessages: (messageDto: Message) => void;
  deleteLocalMessage: (messageId: number) => void;
  setMessageReadState: (conversationId: number, unreadCount: number) => void;
  getLabelOrContact: (messageConversation: MessageConversation) => string;
}

export const useMessageActions = (): MessageActionProps => {
  const { state: messageLoading } = useRecoilValueLoadable(messageState.messages);
  const { state: conversationLoading, contents: conversations } = useRecoilValueLoadable(
    messageState.messageCoversations,
  );
  const setMessageConversation = useSetMessageConversations();
  const setMessages = useSetMessages();
  const { getContactByNumber } = useContactActions();

  const updateLocalConversations = useCallback(
    (conversation: MessageConversation) => {
      setMessageConversation((curVal) => [conversation, ...curVal]);
    },
    [setMessageConversation],
  );

  const setMessageReadState = useCallback(
    (conversationId: number, unreadCount: number) => {
      setMessageConversation((curVal) =>
        curVal.map((message: MessageConversation) => {
          if (message.id === conversationId) {
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

  const getLabelOrContact = useCallback(
    (messageConversation: MessageConversation): string => {
      const conversationLabel = messageConversation.label;
      // This is the source
      const participant = messageConversation.participant;
      const conversationList = messageConversation.conversationList.split('+');

      // Label is required if the conversation is a group chat
      if (messageConversation.isGroupChat) return conversationLabel;

      for (const p of conversationList) {
        if (p !== participant) {
          const contact = getContactByNumber(p);
          return contact ? contact.display : p;
        }
      }
    },
    [getContactByNumber],
  );

  const removeLocalConversation = useCallback(
    (conversationsId: number[]) => {
      if (conversationLoading !== 'hasValue') return;

      if (!conversations.length) return;

      setMessageConversation((curVal) =>
        [...curVal].filter((conversation) => !conversationsId.includes(conversation.id)),
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
          is_embed: messageDto.is_embed,
          embed: messageDto.embed,
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
    getLabelOrContact,
  };
};
