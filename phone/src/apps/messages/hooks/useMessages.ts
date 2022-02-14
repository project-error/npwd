import { useCallback } from 'react';
import { useRecoilValue, useRecoilValueLoadable, useSetRecoilState, waitForAll } from 'recoil';
import { MessageConversation } from '@typings/messages';
import { messageState, useSetConversationId } from './state';
import { useHistory } from 'react-router';

interface IUseMessages {
  conversations?: MessageConversation[];
  getMessageConversationById: (id: number) => MessageConversation | null;
  setActiveMessageConversation: (conversation_id: number) => MessageConversation | null;
  activeMessageConversation: MessageConversation | null;

  goToConversation(g: Pick<MessageConversation, 'id'>): void;
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
    (id: number): MessageConversation | null => {
      if (conversationLoading !== 'hasValue') return;

      if (!contents.length) return;

      // FIXME: Make sure we have contents as a number as well..
      return contents && contents.find((c) => c.id === id);
    },
    [contents, conversationLoading],
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
      if (!messageConversation?.id || !history) return;
      setCurrentConversationId(messageConversation.id);

      history.push(`/messages/conversations/${messageConversation.id.toString()}`);
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
