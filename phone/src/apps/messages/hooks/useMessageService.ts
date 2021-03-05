import { useSetRecoilState } from 'recoil';
import { messageState } from './state';
import { useNuiEvent } from '../../../os/nui-events/hooks/useNuiEvent';
import { IAlert, useSnackbar } from '../../../ui/hooks/useSnackbar';
import { useTranslation } from 'react-i18next';
import { useMessageNotifications } from './useMessageNotifications';
import { useCallback, useEffect } from 'react';
import Nui from '../../../os/nui-events/utils/Nui';

export const useMessagesService = () => {
  const setMessageGroups = useSetRecoilState(messageState.messageGroups);
  const setMessages = useSetRecoilState(messageState.messages);
  const setCreateMessageGroupResult = useSetRecoilState(messageState.createMessageGroupResult);
  const { addAlert } = useSnackbar();
  const { setNotification } = useMessageNotifications();
  const { t } = useTranslation();

  useEffect(() => {
    Nui.send('phone:fetchMessageGroups');
  }, []);

  const handleAddAlert = useCallback(
    ({ message, type }: IAlert) => {
      addAlert({
        message: t(`APPS_${message}`),
        type,
      });
    },
    [addAlert, t],
  );

  useNuiEvent('MESSAGES', 'phone:fetchMessageGroupsSuccess', setMessageGroups);
  useNuiEvent('MESSAGES', 'phone:fetchMessagesSuccess', setMessages);
  useNuiEvent('MESSAGES', 'phone:createMessageGroupSuccess', setCreateMessageGroupResult);
  useNuiEvent('MESSAGES', 'phone:createMessageGroupFailed', setCreateMessageGroupResult);
  useNuiEvent('MESSAGES', 'createMessagesBroadcast', setNotification);
  useNuiEvent('MESSAGES', 'phone:setMessagesAlert', handleAddAlert);
};
