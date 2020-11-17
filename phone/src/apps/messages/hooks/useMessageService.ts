import { useSetRecoilState } from 'recoil';
import { messageState } from './state';
import { useMessages } from './useMessages';
import { useNuiEvent } from '../../../os/nui-events/hooks/useNuiEvent';
import { useConversation } from './useConversation';


export const useMessagesService = () => {
  const setMessages = useSetRecoilState(messageState.messageList);
  const setConversation = useSetRecoilState(messageState.conversation);
  useNuiEvent('MESSAGES', 'setMessages', setMessages);
  useNuiEvent('MESSAGES', 'setConversations', setConversation);
  return { useMessages, useConversation };
}