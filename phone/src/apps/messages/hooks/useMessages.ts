import { useCallback } from 'react';
import { useRecoilValue, useRecoilValueLoadable, useSetRecoilState, waitForAll } from 'recoil';
import { MessageConversation } from '../../../../../typings/messages';
import { messageState, useSetConversationId } from './state';
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

  const { state: conversationLoading, contents } = useRecoilValueLoadable(
    messageState.messageCoversations,
  );
  const [activeMessageConversation] = useRecoilValue(
    waitForAll([messageState.activeMessageConversation]),
  );

  const setCurrentConversationId = useSetConversationId();
  const _setActiveMessageConversation = useSetRecoilState(messageState.activeMessageConversation);

  const getMessageConversationById = useCallback(
    (id: string): MessageConversation | null => {
      if (conversationLoading !== 'hasValue') return;

      if (!contents.length) return;

      return contents && contents.find((c) => c.conversation_id === id);
    },
    [contents, conversationLoading],
  );

  const setActiveMessageConversation = useCallback(
    (groupId: string) => {
      const group = getMessageConversationById(groupId);
      _setActiveMessageConversation(group);
      return group;
    },
    [_setActiveMessageConversation, getMessageConversationById],
  );

  const goToConversation = useCallback(
    (messageGroup) => {
      if (!messageGroup?.conversation_id || !history) return;
      setCurrentConversationId(messageGroup.conversation_id);

      history.push(`/messages/conversations/${messageGroup.conversation_id}`);
    },
    [setCurrentConversationId, history],
  );

  return {
    activeMessageConversation,
    setActiveMessageConversation,
    getMessageConversationById,
    goToConversation,
    conversations: contents,
  };
};

export default useMessages;
