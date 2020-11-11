import { useRecoilState } from 'recoil';
import { messageState } from './state';

export const useMessages = (): any => {
  const [messages, setMessages] = useRecoilState(messageState.messageList);
  return { messages, setMessages };
}