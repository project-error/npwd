import { useRecoilState, useSetRecoilState } from 'recoil';
import { messageState } from './state';
import { useNuiEvent, useNuiRequest } from 'fivem-nui-react-lib';
import { IAlert, useSnackbar } from '../../../ui/hooks/useSnackbar';
import { useTranslation } from 'react-i18next';
import { useMessageNotifications } from './useMessageNotifications';
import { useCallback } from 'react';
import { useLocation } from 'react-router';
import { MessageEvents } from '../../../../../typings/messages';
import { TOptionsBase } from 'i18next';

export const useMessagesService = () => {
  const Nui = useNuiRequest();
  const { pathname } = useLocation();
  const [activeMessageGroup, setActiveMessageGroup] = useRecoilState(
    messageState.activeMessageConversation,
  );
  const setMessageGroups = useSetRecoilState(messageState.activeMessageConversation);
  const setMessages = useSetRecoilState(messageState.messages);
  const setCreateMessageGroupResult = useSetRecoilState(messageState.createMessageGroupResult);
  const { addAlert } = useSnackbar();
  const { setNotification } = useMessageNotifications();
  const { t } = useTranslation();

  const handleAddAlert = useCallback(
    ({ message, type, options = {} }: IAlert & { options: TOptionsBase }) => {
      addAlert({
        message: t(`${message}`, options),
        type,
      });
    },
    [addAlert, t],
  );

  const handleMessageBroadcast = useCallback(
    ({ groupId, message }) => {
      if (groupId === activeMessageGroup?.conversation_id) {
        Nui.send(MessageEvents.FETCH_MESSAGES, { groupId: activeMessageGroup.conversation_id });
        if (pathname.includes('messages/conversations')) {
          // Dont trigger notification if conversation is open.
          return;
        }
      }
      setNotification({ groupId, message });
    },
    [activeMessageGroup, pathname, setNotification, Nui],
  );

  const _setMessageGroups = useCallback(
    (groups) => {
      if (activeMessageGroup && activeMessageGroup.conversation_id) {
        setActiveMessageGroup(
          (curr) => groups.find((g) => g.groupId === activeMessageGroup.conversation_id) || curr,
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
