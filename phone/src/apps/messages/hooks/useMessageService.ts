import { useSetRecoilState } from 'recoil';
import { messageState } from './state';
import { useNuiEvent } from '../../../os/nui-events/hooks/useNuiEvent';


export const useMessagesService = () => {
  const setMessageGroups = useSetRecoilState(messageState.messageGroups);
  const setMessages = useSetRecoilState(messageState.messages);

  useNuiEvent('MESSAGES', 'phone:fetchMessageGroupsSuccess', setMessageGroups);
  useNuiEvent('MESSAGES', 'phone:fetchMessagesSuccess', setMessages);
}