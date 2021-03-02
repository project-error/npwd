import { useRecoilState, useRecoilValue } from 'recoil';
import { CreateMessageGroupResult, Message, MessageGroup } from '../../../common/typings/messages';
import { messageState } from './state';

interface IUseMessages {
  messages?: Message[] | null;
  setMessages: (messages: Message[] | null) => void;
  messageGroups?: MessageGroup[] | null;
  createMessageGroupResult?: CreateMessageGroupResult | null;
  clearMessageGroupResult(): void;
}

export default (): IUseMessages => {
  const [messages, setMessages] = useRecoilState<Message[] | null>(messageState.messages);
  const messageGroups = useRecoilValue<MessageGroup[] | null>(messageState.messageGroups);

  const [
    createMessageGroupResult,
    setCreateMessageGroupResult,
  ] = useRecoilState<CreateMessageGroupResult | null>(messageState.createMessageGroupResult);

  const clearMessageGroupResult = () => setCreateMessageGroupResult(null);

  return {
    messages,
    setMessages,
    messageGroups,
    createMessageGroupResult,
    clearMessageGroupResult,
  };
};
