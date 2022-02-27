import fetchNui from '@utils/fetchNui';
import {
  Message,
  MessageConversation,
  MessageEvents,
  PreDBConversation,
  PreDBMessage,
} from '@typings/messages';
import { ServerPromiseResp } from '@typings/common';
import { useSnackbar } from '@os/snackbar/hooks/useSnackbar';
import { useTranslation } from 'react-i18next';
import { useMessageActions } from './useMessageActions';
import { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { messageState, useSetMessages } from './state';
import { useRecoilValueLoadable } from 'recoil';
import { mockedConversationMessages } from '../utils/constants';
import { useMyPhoneNumber } from '@os/simcard/hooks/useMyPhoneNumber';

type UseMessageAPIProps = {
  sendMessage: ({ conversationId, message, tgtPhoneNumber }: PreDBMessage) => void;
  sendEmbedMessage: ({ conversationId, embed }: PreDBMessage) => void;
  deleteMessage: (message: Message) => void;
  addConversation: (conversation: PreDBConversation) => void;
  deleteConversation: (conversationIds: number[]) => void;
  fetchMessages: (conversationId: string, page: number) => void;
  setMessageRead: (conversationId: number) => void;
};

export const useMessageAPI = (): UseMessageAPIProps => {
  const { addAlert } = useSnackbar();
  const [t] = useTranslation();
  const {
    updateLocalMessages,
    deleteLocalMessage,
    updateLocalConversations,
    removeLocalConversation,
    setMessageReadState,
  } = useMessageActions();
  const history = useHistory();
  const { state: messageConversationsState, contents: messageConversationsContents } =
    useRecoilValueLoadable(messageState.messageCoversations);
  const setMessages = useSetMessages();

  const myPhoneNumber = useMyPhoneNumber();

  const sendMessage = useCallback(
    ({ conversationId, message, tgtPhoneNumber, conversationList }: PreDBMessage) => {
      fetchNui<Message>(MessageEvents.SEND_MESSAGE, {
        conversationId,
        conversationList,
        message,
        tgtPhoneNumber,
        sourcePhoneNumber: myPhoneNumber,
      })
        .then((resp) => {
          resp && updateLocalMessages(resp);
        })
        .catch(() => {
          return addAlert({
            message: t('MESSAGES.FEEDBACK.NEW_MESSAGE_FAILED'),
            type: 'error',
          });
        });
    },
    [updateLocalMessages, t, addAlert, myPhoneNumber],
  );

  const sendEmbedMessage = useCallback(
    ({ conversationId, embed, tgtPhoneNumber, conversationList }: PreDBMessage) => {
      fetchNui<Message, PreDBMessage>(MessageEvents.SEND_MESSAGE, {
        conversationId,
        embed: JSON.stringify(embed),
        is_embed: true,
        tgtPhoneNumber,
        conversationList,
        sourcePhoneNumber: myPhoneNumber ?? 'unknown',
      }).catch(() => {
        return addAlert({
          message: t('MESSAGES.FEEDBACK.NEW_MESSAGE_FAILED'),
          type: 'error',
        });
      });
    },
    [t, addAlert, myPhoneNumber],
  );

  const setMessageRead = useCallback(
    (conversationId: number) => {
      fetchNui<ServerPromiseResp<void>>(MessageEvents.SET_MESSAGE_READ, conversationId)
        .then((resp) => {
          setMessageReadState(conversationId, 0);
        })
        .catch(() => {
          return addAlert({
            message: 'Failed to read message',
            type: 'error',
          });
        });
    },
    [addAlert, setMessageReadState],
  );

  const deleteMessage = useCallback(
    (message: Message) => {
      fetchNui<boolean>(MessageEvents.DELETE_MESSAGE, message)
        .then(() => {
          deleteLocalMessage(message.id);
        })
        .catch(() => {
          return addAlert({
            message: t('MESSAGES.FEEDBACK.DELETE_MESSAGE_FAILED'),
            type: 'error',
          });
        });
    },
    [deleteLocalMessage, addAlert, t],
  );

  const addConversation = useCallback(
    (conversation: PreDBConversation) => {
      if (messageConversationsState !== 'hasValue') {
        return;
      }

      fetchNui<MessageConversation, PreDBConversation>(MessageEvents.CREATE_MESSAGE_CONVERSATION, {
        conversationLabel: conversation.conversationLabel,
        participants: conversation.participants,
        isGroupChat: conversation.isGroupChat,
      })
        .then((resp) => {
          // FIXME: This won't work properly has the conversationList will differ each time someone creates a convo.
          // FIXME: Just like this for now.

          if (!resp) {
            history.push(`/messages`);
            return;
          }

          const doesConversationExist = messageConversationsContents.find(
            (c) => c.conversationList === resp.conversationList,
          );

          if (doesConversationExist) {
            history.push('/messages');
            return addAlert({
              message: t('MESSAGES.FEEDBACK.MESSAGE_CONVERSATION_DUPLICATE'),
              type: 'error',
            });
          }

          updateLocalConversations({
            participant: resp.participant,
            id: resp.id,
            conversationList: resp.conversationList,
            label: resp.label,
            isGroupChat: resp.isGroupChat,
            unread: 0,
            unreadCount: 0,
          });

          history.push(`/messages`);
        })
        .catch((err) => {
          history.push('/messages');

          if (err === 'MESSAGES.FEEDBACK.MESSAGE_CONVERSATION_DUPLICATE') {
            return addAlert({
              message: t('MESSAGES.FEEDBACK.MESSAGE_CONVERSATION_DUPLICATE'),
              type: 'error',
            });
          }

          return addAlert({
            message: t('MESSAGE_CONVERSATION_CREATE_ONE_NUMBER_FAILED"', {
              number: conversation.conversationLabel,
            }),
            type: 'error',
          });
        });
    },
    [
      history,
      updateLocalConversations,
      addAlert,
      t,
      messageConversationsContents,
      messageConversationsState,
    ],
  );

  const deleteConversation = useCallback(
    (conversationIds: number[]) => {
      fetchNui<ServerPromiseResp<void>>(MessageEvents.DELETE_CONVERSATION, {
        conversationsId: conversationIds,
      })
        .then(() => {
          removeLocalConversation(conversationIds);
        })
        .catch(() => {
          return addAlert({
            message: t('MESSAGES.DELETE_CONVERSATION_FAILED'),
            type: 'error',
          });
        });
    },
    [addAlert, t, removeLocalConversation],
  );

  const fetchMessages = useCallback(
    (conversationId: string, page: number) => {
      fetchNui<Message[]>(
        MessageEvents.FETCH_MESSAGES,
        {
          conversationId,
          page,
        },
        mockedConversationMessages,
      )
        .then((resp) => {
          setMessages(resp ?? []);
        })
        .catch(() => {
          addAlert({
            message: t('MESSAGES.FEEDBACK.FETCHED_MESSAGES_FAILED'),
            type: 'error',
          });
          return history.push('/messages');
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
    sendEmbedMessage,
    setMessageRead,
  };
};
