import { useCallback } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { CreateMessageGroupResult, Message, MessageGroup } from '../../../../../typings/messages';
import { messageState } from './state';

interface IUseMessages {
  messages?: Message[] | null;
  setMessages: (messages: Message[] | null) => void;
  messageGroups?: MessageGroup[] | null;
  createMessageGroupResult?: CreateMessageGroupResult | null;
  clearMessageGroupResult(): void;
  getMessageGroupById: (id: string) => MessageGroup | null;
  setActiveMessageGroup: (groupId: string) => MessageGroup | null;
  activeMessageGroup: MessageGroup | null;
}

export default (): IUseMessages => {
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

  return {
    messages,
    setMessages,
    messageGroups,
    createMessageGroupResult,
    clearMessageGroupResult,
    getMessageGroupById,
    activeMessageGroup,
    setActiveMessageGroup,
  };
};
