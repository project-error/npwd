import { useRecoilValue } from 'recoil';
import { messageState } from './state';

export const useConversation = (): any => {
  const conversation = useRecoilValue(messageState.conversation);
  return { conversation }
}