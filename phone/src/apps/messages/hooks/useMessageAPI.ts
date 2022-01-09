import fetchNui from '@utils/fetchNui';
import {
  Message,
  MessageConversationResponse,
  MessageEvents,
  PreDBMessage,
} from '@typings/messages';
import { ServerPromiseResp } from '@typings/common';
import { useSnackbar } from '@os/snackbar/hooks/useSnackbar';
import { useTranslation } from 'react-i18next';
import { useMessageActions } from './useMessageActions';
import { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { messageState, useSetMessages } from './state';
import { useContactActions } from '../../contacts/hooks/useContactActions';
import { useRecoilValueLoadable } from 'recoil';
import { MockConversationServerResp } from '../utils/constants';

type UseMessageAPIProps = {
  sendMessage: ({ conversationId, message }: PreDBMessage) => void;
  deleteMessage: (message: Message) => void;
  addConversation: (targetNumber: string) => void;
  deleteConversation: (conversationIds: string[]) => void;
  fetchMessages: (conversationId: string, page: number) => void;
};

export const useMessageAPI = (): UseMessageAPIProps => {
  const { addAlert } = useSnackbar();
  const [t] = useTranslation();
  const {
    updateLocalMessages,
    deleteLocalMessage,
    updateLocalConversations,
    removeLocalConversation,
  } = useMessageActions();
  const history = useHistory();
  const { state: messageConversationsState, contents: messageConversationsContents } =
    useRecoilValueLoadable(messageState.messageCoversations);
  const { getPictureByNumber, getDisplayByNumber } = useContactActions();
  const setMessages = useSetMessages();

  const sendMessage = useCallback(
    ({ conversationId, message }: PreDBMessage) => {
      fetchNui<ServerPromiseResp<Message>>(MessageEvents.SEND_MESSAGE, {
        conversationId,
        message,
      }).then((resp) => {
        if (resp.status !== 'ok') {
          return addAlert({
            message: t('MESSAGES.FEEDBACK.NEW_MESSAGE_FAILED'),
            type: 'error',
          });
        }

        updateLocalMessages(resp.data);
      });
    },
    [updateLocalMessages, t, addAlert],
  );

  const deleteMessage = useCallback(
    (message: Message) => {
      fetchNui<ServerPromiseResp<any>>(MessageEvents.DELETE_MESSAGE, message).then((resp) => {
        if (resp.status !== 'ok') {
          return addAlert({
            message: t('MESSAGES.FEEDBACK.DELETE_MESSAGE_FAILED'),
            type: 'error',
          });
        }

        deleteLocalMessage(message.id);
      });
    },
    [deleteLocalMessage, addAlert, t],
  );

  const addConversation = useCallback(
    (targetNumber: string) => {
      if (messageConversationsState !== 'hasValue') {
        return;
      }

      fetchNui<ServerPromiseResp<MessageConversationResponse>>(
        MessageEvents.CREATE_MESSAGE_CONVERSATION,
        {
          targetNumber,
        },
      ).then((resp) => {
        if (resp.status !== 'ok') {
          history.push('/messages');
          return addAlert({
            message: t('MESSAGE_CONVERSATION_CREATE_ONE_NUMBER_FAILED"', {
              number: targetNumber,
            }),
            type: 'error',
          });
        }

        const doesConversationExist = messageConversationsContents.find(
          (c) => c.conversation_id === resp.data.conversation_id,
        );

        if (doesConversationExist) {
          history.push('/messages');
          return addAlert({
            message: t('MESSAGES.FEEDBACK.MESSAGE_CONVERSATION_DUPLICATE'),
            type: 'error',
          });
        }

        const display = getDisplayByNumber(resp.data.phoneNumber);
        const avatar = getPictureByNumber(resp.data.phoneNumber);

        updateLocalConversations({
          phoneNumber: resp.data.phoneNumber,
          conversation_id: resp.data.conversation_id,
          display,
          unread: 0,
          avatar,
        });

        history.push(`/messages/conversations/${resp.data.conversation_id}`);
      });
    },
    [
      history,
      updateLocalConversations,
      addAlert,
      t,
      getDisplayByNumber,
      getPictureByNumber,
      messageConversationsContents,
      messageConversationsState,
    ],
  );

  const deleteConversation = useCallback(
    (conversationIds: string[]) => {
      fetchNui<ServerPromiseResp<void>>(MessageEvents.DELETE_CONVERSATION, {
        conversationsId: conversationIds,
      }).then((resp) => {
        if (resp.status !== 'ok') {
          return addAlert({
            message: t('MESSAGES.DELETE_CONVERSATION_FAILED'),
            type: 'error',
          });
        }

        removeLocalConversation(conversationIds);
      });
    },
    [addAlert, t, removeLocalConversation],
  );

  const fetchMessages = useCallback(
    (conversationId: string, page: number) => {
      fetchNui<ServerPromiseResp<Message[]>>(
        MessageEvents.FETCH_MESSAGES,
        {
          conversationId,
          page,
        },
        MockConversationServerResp,
      ).then((resp) => {
        if (resp.status !== 'ok') {
          addAlert({
            message: t('MESSAGES.FEEDBACK.FETCHED_MESSAGES_FAILED'),
            type: 'error',
          });

          return history.push('/messages');
        }

        setMessages(resp.data);
      });
    },
    [setMessages, addAlert, t, history],
  );

  return {
    sendMessage,
    deleteMessage,
    deleteConversation,
    addConversation,
    fetchMessages,
  };
};
