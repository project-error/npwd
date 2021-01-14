import { useSetRecoilState } from 'recoil';
import { messageState } from './state';
import { useNuiEvent } from '../../../os/nui-events/hooks/useNuiEvent';

export const useMessagesService = () => {
  const setMessageGroups = useSetRecoilState(messageState.messageGroups);
  const setMessages = useSetRecoilState(messageState.messages);
  const setCreateMessageGroupResult = useSetRecoilState(
    messageState.createMessageGroupResult
  );

  useNuiEvent('MESSAGES', 'phone:fetchMessageGroupsSuccess', setMessageGroups);
  useNuiEvent('MESSAGES', 'phone:fetchMessagesSuccess', setMessages);
  useNuiEvent(
    'MESSAGES',
    'phone:createMessageGroupSuccess',
    setCreateMessageGroupResult
  );
  useNuiEvent(
    'MESSAGES',
    'phone:createMessageGroupFailed',
    setCreateMessageGroupResult
  );
};
