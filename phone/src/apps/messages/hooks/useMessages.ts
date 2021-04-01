import { useCallback } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
  CreateMessageGroupResult,
  Message,
  MessageEvents,
  MessageGroup,
} from '../../../../../typings/messages';
import { messageState } from './state';
import { useNuiRequest } from 'fivem-nui-react-lib';
import { useHistory } from 'react-router';

interface IUseMessages {
  messages?: Message[] | null;
  setMessages: (messages: Message[] | null) => void;
  messageGroups?: MessageGroup[] | null;
  createMessageGroupResult?: CreateMessageGroupResult | null;
  clearMessageGroupResult(): void;
  getMessageGroupById: (id: string) => MessageGroup | null;
  setActiveMessageGroup: (groupId: string) => MessageGroup | null;
  activeMessageGroup: MessageGroup | null;
  goToConversation(g: Pick<MessageGroup, 'groupId'>): void;
}

const useMessages = (): IUseMessages => {
  const Nui = useNuiRequest();
  const history = useHistory();

  const [messages, setMessages] = useRecoilState<Message[] | null>(messageState.messages);
  const messageGroups = useRecoilValue<MessageGroup[] | null>(messageState.messageGroups);
  const [activeMessageGroup, _setActiveMessageGroup] = useRecoilState<MessageGroup | null>(
    messageState.activeMessageGroup,
  );

  const getMessageGroupById = useCallback(
    (id: string): MessageGroup | null => {
      return messageGroups ? messageGroups.find((c) => c.groupId === id) : null;
    },
    [messageGroups],
  );

  const [
    createMessageGroupResult,
    setCreateMessageGroupResult,
  ] = useRecoilState<CreateMessageGroupResult | null>(messageState.createMessageGroupResult);

  const clearMessageGroupResult = () => setCreateMessageGroupResult(null);

  const setActiveMessageGroup = useCallback(
    (groupId: string) => {
      const group = getMessageGroupById(groupId);
      _setActiveMessageGroup(group);
      return group;
    },
    [_setActiveMessageGroup, getMessageGroupById],
  );

  const goToConversation = (messageGroup) => {
    if (!messageGroup?.groupId || !history) return;
    history.push(`/messages/conversations/${messageGroup.groupId}`);
    Nui.send(MessageEvents.FETCH_MESSAGES, { groupId: messageGroup.groupId });
  };

  return {
    messages,
    setMessages,
    messageGroups,
    createMessageGroupResult,
    clearMessageGroupResult,
    getMessageGroupById,
    activeMessageGroup,
    setActiveMessageGroup,
    goToConversation,
  };
}

export default useMessages;
