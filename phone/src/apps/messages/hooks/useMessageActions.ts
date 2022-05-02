import {
  messageState,
  useConversationId,
  useSetMessageConversations,
  useSetMessages,
} from './state';
import { useCallback } from 'react';
import { Message, MessageConversation } from '@typings/messages';
import { useRecoilValueLoadable } from 'recoil';
import { useContactActions } from '../../contacts/hooks/useContactActions';
import { useMyPhoneNumber } from '@os/simcard/hooks/useMyPhoneNumber';
import { Contact } from '@typings/contact';

interface MessageActionProps {
  updateLocalConversations: (conversation: MessageConversation) => void;
  removeLocalConversation: (conversationId: number[]) => void;
  updateLocalMessages: (messageDto: Message) => void;
  deleteLocalMessage: (messageId: number) => void;
  setMessageReadState: (conversationId: number, unreadCount: number) => void;
  getLabelOrContact: (messageConversation: MessageConversation) => string;
  getConversationParticipant: (conversationList: string) => Contact | null;
}

export const useMessageActions = (): MessageActionProps => {
  const { state: messageLoading } = useRecoilValueLoadable(messageState.messages);
  const { state: conversationLoading, contents: conversations } = useRecoilValueLoadable(
    messageState.messageCoversations,
  );
  const setMessageConversation = useSetMessageConversations();
  const setMessages = useSetMessages();
  const { getContactByNumber } = useContactActions();
  const myPhoneNumber = useMyPhoneNumber();
  const conversationId = useConversationId();

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
              unreadCount: unreadCount,
              updatedAt: Date.now(),
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

      if (conversationId !== messageDto.conversation_id) return;

      setMessages((currVal) => [
        ...currVal,
        {
          message: messageDto.message,
          conversation_id: messageDto.conversation_id,
          author: messageDto.author,
          id: messageDto.id,
          createdAt: messageDto.createdAt,
          is_embed: messageDto.is_embed,
          embed: messageDto.embed,
        },
      ]);
    },
    [messageLoading, setMessages, conversationId],
  );

  const deleteLocalMessage = useCallback(
    (messageId: number) => {
      setMessages((currVal) => [...currVal].filter((msg) => msg.id !== messageId));
    },
    [setMessages],
  );

  const getConversationParticipant = useCallback(
    (conversationList: string) => {
      const participant = conversationList.split('+').filter((p) => p !== myPhoneNumber);

      return getContactByNumber(participant[0]);
    },
    [getContactByNumber, myPhoneNumber],
  );

  return {
    updateLocalConversations,
    removeLocalConversation,
    updateLocalMessages,
    deleteLocalMessage,
    setMessageReadState,
    getLabelOrContact,
    getConversationParticipant,
  };
};
