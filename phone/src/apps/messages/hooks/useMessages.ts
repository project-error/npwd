import { useRecoilState } from 'recoil';
import { MessageGroup } from '../../../common/interfaces/messages';
import { messageState } from './state';

interface IUseMessages {
  messages: MessageGroup[];
  setMessages: any;
  setActiveMessageGroupId: (id: string | null) => void;
  activeMessageGroupId: null | string;
}

export const useMessages = (): IUseMessages => {
  const [ activeMessageGroupId, setActiveMessageGroupId ] = useRecoilState<any>(messageState.activeMessageGroup)
  const [messages, setMessages] = useRecoilState<any>(messageState.messages);
  return { messages, setMessages, activeMessageGroupId, setActiveMessageGroupId };
}