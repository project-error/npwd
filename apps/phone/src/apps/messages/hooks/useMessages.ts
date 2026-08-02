import { useCallback } from 'react';
import { MessageConversation } from '@typings/messages';
import {
  useActiveMessageConversation,
  useMessageConversationsValue,
  useSetActiveMessageConversation,
  useSetConversationId,
} from './state';
import { useNavigate } from 'react-router';

interface IUseMessages {
  conversations?: MessageConversation[];
  getMessageConversationById: (id: number) => MessageConversation | null;
  setActiveMessageConversation: (conversation_id: number) => MessageConversation | null;
  activeMessageConversation: MessageConversation | null;

  goToConversation(g: Pick<MessageConversation, 'id'>): void;
}

const useMessages = (): IUseMessages => {
  const navigate = useNavigate();

  const conversations = useMessageConversationsValue();
  const activeMessageConversation = useActiveMessageConversation();

  const setCurrentConversationId = useSetConversationId();
  const _setActiveMessageConversation = useSetActiveMessageConversation();

  const getMessageConversationById = useCallback(
    (id: number): MessageConversation | null => {
      if (!conversations.length) return null;

      // FIXME: Make sure we have contents as a number as well..
      return conversations.find((c) => c.id === id);
    },
    [conversations],
  );

  const setActiveMessageConversation = useCallback(
    (groupId: number) => {
      const group = getMessageConversationById(groupId);
      _setActiveMessageConversation(group);
      return group;
    },
    [_setActiveMessageConversation, getMessageConversationById],
  );

  const goToConversation = useCallback(
    (messageConversation: MessageConversation) => {
      if (!messageConversation?.id) return;
      setCurrentConversationId(messageConversation.id);

      navigate(`/messages/conversations/${messageConversation.id.toString()}`);
    },
    [setCurrentConversationId, navigate],
  );

  return {
    activeMessageConversation,
    setActiveMessageConversation,
    getMessageConversationById,
    goToConversation,
    conversations,
  };
};

export default useMessages;
