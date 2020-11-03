import { useSetRecoilState } from 'recoil';
import { messageState } from './state';
import { useMessages } from './useMessages';
import { useNuiEvent } from '../../../os/nui-events/hooks/useNuiEvent';

export const useMessagesService = () => {
  const setMessages = useSetRecoilState(messageState.messageList);
  useNuiEvent('MESSAGES', 'setMessages', setMessages);
  return useMessages();
}