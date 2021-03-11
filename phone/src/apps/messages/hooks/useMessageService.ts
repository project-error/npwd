import { useRecoilState, useSetRecoilState } from 'recoil';
import { messageState } from './state';
import { useNuiEvent } from '../../../os/nui-events/hooks/useNuiEvent';
import { IAlert, useSnackbar } from '../../../ui/hooks/useSnackbar';
import { useTranslation } from 'react-i18next';
import { useMessageNotifications } from './useMessageNotifications';
import { useCallback } from 'react';
import Nui from '../../../os/nui-events/utils/Nui';

export const useMessagesService = () => {
  const [activeMessageGroup, setActiveMessageGroup] = useRecoilState(
    messageState.activeMessageGroup,
  );
  const setMessageGroups = useSetRecoilState(messageState.messageGroups);
  const setMessages = useSetRecoilState(messageState.messages);
  const setCreateMessageGroupResult = useSetRecoilState(messageState.createMessageGroupResult);
  const { addAlert } = useSnackbar();
  const { setNotification } = useMessageNotifications();
  const { t } = useTranslation();

  const handleAddAlert = useCallback(
    ({ message, type }: IAlert) => {
      addAlert({
        message: t(`APPS_${message}`),
        type,
      });
    },
    [addAlert, t],
  );

  const handleMessageBroadcast = useCallback(
    ({ groupId, message }) => {
      if (groupId === activeMessageGroup?.groupId) {
        Nui.send('phone:fetchMessages', { groupId: activeMessageGroup.groupId });
      }
      setNotification({ groupId, message });
    },
    [activeMessageGroup, setNotification],
  );

  const _setMessageGroups = useCallback(
    (groups) => {
      if (activeMessageGroup && activeMessageGroup.groupId) {
        setActiveMessageGroup(
          (curr) => groups.find((g) => g.groupId === activeMessageGroup.groupId) || curr,
        );
      }
      setMessageGroups(groups);
    },
    [activeMessageGroup, setActiveMessageGroup, setMessageGroups],
  );

  useNuiEvent('MESSAGES', 'phone:fetchMessageGroupsSuccess', _setMessageGroups);
  useNuiEvent('MESSAGES', 'phone:fetchMessagesSuccess', setMessages);
  useNuiEvent('MESSAGES', 'phone:createMessageGroupSuccess', setCreateMessageGroupResult);
  useNuiEvent('MESSAGES', 'phone:createMessageGroupFailed', setCreateMessageGroupResult);
  useNuiEvent('MESSAGES', 'createMessagesBroadcast', handleMessageBroadcast);
  useNuiEvent('MESSAGES', 'phone:setMessagesAlert', handleAddAlert);
};
