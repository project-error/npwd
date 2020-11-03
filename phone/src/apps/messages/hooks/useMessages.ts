import { useRecoilValue } from 'recoil';
import { messageState } from './state';

export const useMessages = (): any => {
  const message = useRecoilValue(messageState.messageList);
  return message;
}