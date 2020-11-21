import { useSetRecoilState } from 'recoil';
import { messageState } from './state';
import { useNuiEvent } from '../../../os/nui-events/hooks/useNuiEvent';


const NOTIFICATION_TIMEOUT = 6000;

export const useMessagesService = () => {
  const setMessageGroups = useSetRecoilState(messageState.messageGroups);
  const setMessages = useSetRecoilState(messageState.messages);
  const setCreateMessageGroupResult = useSetRecoilState(messageState.createMessageGroupResult);

  const _handleCreateMessageGroupResult = (result) => {
    console.log(result);
    setCreateMessageGroupResult(result);
    window.setTimeout(() => {
      setCreateMessageGroupResult(null);
    }, NOTIFICATION_TIMEOUT);
  };

  useNuiEvent('MESSAGES', 'phone:fetchMessageGroupsSuccess', setMessageGroups);
  useNuiEvent('MESSAGES', 'phone:fetchMessagesSuccess', setMessages);
  useNuiEvent('MESSAGES', 'phone:createMessageGroupSuccess', _handleCreateMessageGroupResult);
  useNuiEvent('MESSAGES', 'phone:createMessageGroupFailed', _handleCreateMessageGroupResult);
}