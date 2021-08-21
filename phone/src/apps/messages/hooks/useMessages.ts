import { useCallback } from 'react';
import { useRecoilState } from 'recoil';
import { MessageConversation, MessageEvents, Message } from '../../../../../typings/messages';
import { messageState, useMessageConversationValue } from './state';
import { useNuiRequest } from 'fivem-nui-react-lib';
import { useHistory } from 'react-router';

interface IUseMessages {
  messages?: Message[] | null;
  setMessages: (messages: Message[] | null) => void;
  conversations?: MessageConversation[];
  getMessageConversationById: (id: string) => MessageConversation | null;
  setActiveMessageConversation: (conversation_id: string) => MessageConversation | null;
  activeMessageConversation: MessageConversation | null;
  goToConversation(g: Pick<MessageConversation, 'conversation_id'>): void;
}

const useMessages = (): IUseMessages => {
  const Nui = useNuiRequest();
  const history = useHistory();

  const conversations = useMessageConversationValue();

  const [messages, setMessages] = useRecoilState<Message[]>(messageState.messages);
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
    history.push(`/messages/conversations/${messageGroup.conversation_id}`);
    Nui.send(MessageEvents.FETCH_MESSAGES, { groupId: messageGroup.conversation_id });
  };

  return {
    messages,
    setMessages,
    activeMessageConversation,
    setActiveMessageConversation,
    getMessageConversationById,
    goToConversation,
    conversations,
  };
};

export default useMessages;
