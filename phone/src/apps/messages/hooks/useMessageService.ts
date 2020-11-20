import { useSetRecoilState } from 'recoil';
import { messageState } from './state';
import { useNuiEvent } from '../../../os/nui-events/hooks/useNuiEvent';


export const useMessagesService = () => {
  const setMessages = useSetRecoilState(messageState.messages);

  const test = result => console.log(result);

  useNuiEvent('MESSAGES', 'phone:fetchMessagesSuccess', setMessages);
  useNuiEvent('MESSAGES', 'phone:sendMessageSuccess', test);
}