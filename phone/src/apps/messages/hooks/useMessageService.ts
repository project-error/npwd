import { useRecoilState, useSetRecoilState } from 'recoil';
import { messageState } from './state';
import { useNuiEvent } from '../../../os/nui-events/hooks/useNuiEvent';
import { IAlert, useSnackbar } from '../../../ui/hooks/useSnackbar';
import { useTranslation } from 'react-i18next';
import { useMessageNotifications } from './useMessageNotifications';
import { useCallback } from 'react';
import Nui from '../../../os/nui-events/utils/Nui';
import { useLocation } from 'react-router';
import { MessageEvents } from '../../../../../typings/messages';

export const useMessagesService = () => {
  const { pathname } = useLocation();
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
        Nui.send(MessageEvents.FETCH_MESSAGES, { groupId: activeMessageGroup.groupId });
        if (pathname.includes('messages/conversations')) {
          // Dont trigger notification if conversation is open.
          return;
        }
      }
      setNotification({ groupId, message });
    },
    [activeMessageGroup, pathname, setNotification],
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

  useNuiEvent('MESSAGES', MessageEvents.FETCH_MESSAGE_GROUPS_SUCCESS, _setMessageGroups);
  useNuiEvent('MESSAGES', MessageEvents.FETCH_MESSAGES_SUCCESS, setMessages);
  useNuiEvent('MESSAGES', MessageEvents.CREATE_MESSAGE_GROUP_SUCCESS, setCreateMessageGroupResult);
  useNuiEvent('MESSAGES', MessageEvents.CREATE_MESSAGE_GROUP_FAILED, setCreateMessageGroupResult);
  useNuiEvent('MESSAGES', MessageEvents.CREATE_MESSAGE_BROADCAST, handleMessageBroadcast);
  useNuiEvent('MESSAGES', MessageEvents.ACTION_RESULT, handleAddAlert);
};
