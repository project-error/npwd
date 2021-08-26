import { useCallback } from 'react';
import { useRecoilState } from 'recoil';
import { MessageConversation } from '../../../../../typings/messages';
import { messageState, useMessageConversationValue, useSetConversationId } from './state';
import { useHistory } from 'react-router';

interface IUseMessages {
  conversations?: MessageConversation[];
  getMessageConversationById: (id: string) => MessageConversation | null;
  setActiveMessageConversation: (conversation_id: string) => MessageConversation | null;
  activeMessageConversation: MessageConversation | null;
  goToConversation(g: Pick<MessageConversation, 'conversation_id'>): void;
}

const useMessages = (): IUseMessages => {
  const history = useHistory();

  const conversations = useMessageConversationValue();

  const setCurrentConversationId = useSetConversationId();
  const [activeMessageConversation, _setActiveMessageConversation] =
    useRecoilState<MessageConversation | null>(messageState.activeMessageConversation);

  const getMessageConversationById = useCallback(
    (id: string): MessageConversation | null => {
      return conversations && conversations.find((c) => c.conversation_id === id);
    },
    [conversations],
  );

  const setActiveMessageConversation = useCallback(
    (groupId: string) => {
      const group = getMessageConversationById(groupId);
      _setActiveMessageConversation(group);
      return group;
    },
    [_setActiveMessageConversation, getMessageConversationById],
  );

  const goToConversation = (messageGroup) => {
    if (!messageGroup?.conversation_id || !history) return;
    setCurrentConversationId(messageGroup.conversation_id);

    history.push(`/messages/conversations/${messageGroup.conversation_id}`);
  };

  return {
    activeMessageConversation,
    setActiveMessageConversation,
    getMessageConversationById,
    goToConversation,
    conversations,
  };
};

export default useMessages;
