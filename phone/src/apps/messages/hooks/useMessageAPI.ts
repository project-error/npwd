import fetchNui from '@utils/fetchNui';
import {
  ConversationListResponse,
  Message,
  MessageConversation,
  MessageEvents,
  PreDBConversation,
  PreDBMessage,
  RemoveGroupMemberRequest,
} from '@typings/messages';
import { ServerPromiseResp } from '@typings/common';
import { useSnackbar } from '@os/snackbar/hooks/useSnackbar';
import { useTranslation } from 'react-i18next';
import { useMessageActions } from './useMessageActions';
import { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { messageState, useSetMessages } from './state';
import { useRecoilValueLoadable } from 'recoil';
import { MockConversationServerResp } from '../utils/constants';
import { useMyPhoneNumber } from '@os/simcard/hooks/useMyPhoneNumber';

type UseMessageAPIProps = {
  sendMessage: ({ conversationId, message, tgtPhoneNumber }: PreDBMessage) => void;
  sendEmbedMessage: ({ conversationId, embed }: PreDBMessage) => void;
  sendSystemMessage: ({
    conversationId,
    is_system,
    system_type,
    system_number,
  }: PreDBMessage) => void;
  deleteMessage: (message: Message) => void;
  addConversation: (conversation: PreDBConversation) => void;
  deleteConversation: (conversationIds: number[]) => void;
  fetchMessages: (conversationId: string, page: number) => void;
  setMessageRead: (conversationId: number) => void;
  removeGroupMember: (
    conversationList: string,
    conversationId: number,
    phoneNumber: string,
  ) => void;
  leaveGroup: (conversationList: string, conversationId: number, phoneNumber: string) => void;
  makeGroupOwner: (conversationId: number, phoneNumber: string) => void;
};

export const useMessageAPI = (): UseMessageAPIProps => {
  const { addAlert } = useSnackbar();
  const [t] = useTranslation();
  const {
    updateLocalMessages,
    deleteLocalMessage,
    updateLocalConversations,
    removeLocalConversation,
    removeLocalGroupMember,
    setMessageReadState,
    updateLocalGroupOwner,
  } = useMessageActions();
  const history = useHistory();
  const { state: messageConversationsState, contents: messageConversationsContents } =
    useRecoilValueLoadable(messageState.messageCoversations);
  const setMessages = useSetMessages();

  const myPhoneNumber = useMyPhoneNumber();

  const sendMessage = useCallback(
    ({ conversationId, message, tgtPhoneNumber, conversationList }: PreDBMessage) => {
      fetchNui<ServerPromiseResp<Message>>(MessageEvents.SEND_MESSAGE, {
        conversationId,
        conversationList,
        message,
        tgtPhoneNumber,
        sourcePhoneNumber: myPhoneNumber,
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
    [updateLocalMessages, t, addAlert, myPhoneNumber],
  );

  const sendEmbedMessage = useCallback(
    ({ conversationId, embed, tgtPhoneNumber, conversationList, message = '' }: PreDBMessage) => {
      fetchNui<ServerPromiseResp<Message>, PreDBMessage>(MessageEvents.SEND_MESSAGE, {
        conversationId,
        embed: JSON.stringify(embed),
        is_embed: true,
        tgtPhoneNumber,
        conversationList,
        sourcePhoneNumber: myPhoneNumber,
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
    [t, updateLocalMessages, addAlert, myPhoneNumber],
  );

  const setMessageRead = useCallback(
    (conversationId: number) => {
      fetchNui<ServerPromiseResp<void>>(MessageEvents.SET_MESSAGE_READ, conversationId).then(
        (resp) => {
          if (resp.status !== 'ok') {
            return addAlert({
              message: 'Failed to read message',
              type: 'error',
            });
          }

          setMessageReadState(conversationId, 0);
        },
      );
    },
    [addAlert, setMessageReadState],
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
    (conversation: PreDBConversation) => {
      if (messageConversationsState !== 'hasValue') {
        return;
      }

      fetchNui<ServerPromiseResp<MessageConversation>, PreDBConversation>(
        MessageEvents.CREATE_MESSAGE_CONVERSATION,
        {
          conversationLabel: conversation.conversationLabel,
          participants: conversation.participants,
          isGroupChat: conversation.isGroupChat,
        },
      ).then((resp) => {
        if (resp.status !== 'ok') {
          history.push('/messages');

          if (resp.errorMsg === 'MESSAGES.FEEDBACK.MESSAGE_CONVERSATION_DUPLICATE') {
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
        }

        // FIXME: This won't work properly has the conversationList will differ each time someone creates a convo.
        // FIXME: Just like this for now.
        const doesConversationExist = messageConversationsContents.find(
          (c) => c.conversationList === resp.data.conversationList,
        );

        if (doesConversationExist) {
          history.push('/messages');
          return addAlert({
            message: t('MESSAGES.FEEDBACK.MESSAGE_CONVERSATION_DUPLICATE'),
            type: 'error',
          });
        }

        updateLocalConversations({
          participant: resp.data.participant,
          id: resp.data.id,
          conversationList: resp.data.conversationList,
          label: resp.data.label,
          isGroupChat: resp.data.isGroupChat,
          unread: 0,
          unreadCount: 0,
          owner: resp.data.owner,
        });

        history.push(`/messages`);
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

  const sendSystemMessage = useCallback(
    ({
      conversationId,
      conversationList,
      tgtPhoneNumber = '',
      is_system,
      system_number,
      system_type,
    }: PreDBMessage) => {
      fetchNui<ServerPromiseResp<Message>, PreDBMessage>(MessageEvents.SEND_MESSAGE, {
        conversationId,
        conversationList,
        message: '',
        tgtPhoneNumber,
        sourcePhoneNumber: myPhoneNumber,
        is_system,
        system_number,
        system_type,
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
    [t, updateLocalMessages, addAlert, myPhoneNumber],
  );

  const makeGroupOwner = useCallback(
    (conversationId: number, phoneNumber: string) => {
      fetchNui<ServerPromiseResp<void>>(MessageEvents.MAKE_GROUP_OWNER, {
        conversationId,
        phoneNumber,
      }).then((resp) => {
        if (resp.status !== 'ok') {
          return addAlert({
            message: t('MESSAGES.FEEDBACK.MAKE_GROUP_OWNER_FAILED'),
            type: 'error',
          });
        }
        updateLocalGroupOwner(conversationId, phoneNumber);
      });
    },
    [addAlert, updateLocalGroupOwner, t],
  );

  const removeGroupMember = useCallback(
    (conversationList: string, conversationId: number, phoneNumber: string) => {
      fetchNui<ServerPromiseResp<ConversationListResponse>, RemoveGroupMemberRequest>(
        MessageEvents.DELETE_GROUP_MEMBER,
        {
          conversationList,
          conversationId,
          phoneNumber,
          leaveGroup: false,
        },
      ).then((resp) => {
        if (resp.status !== 'ok') {
          return addAlert({
            message: t('MESSAGES.FEEDBACK.DELETE_GROUP_MEMBER_FAILED'),
            type: 'error',
          });
        }
        removeLocalGroupMember(conversationId, phoneNumber);
        sendSystemMessage({
          conversationId: conversationId,
          conversationList: resp.data.conversationList,
          tgtPhoneNumber: '',
          is_system: true,
          system_number: phoneNumber,
          system_type: 'remove',
        });
      });
    },
    [addAlert, removeLocalGroupMember, sendSystemMessage, t],
  );

  const leaveGroup = useCallback(
    (conversationList: string, conversationId: number, phoneNumber: string) => {
      fetchNui<ServerPromiseResp<void>>(MessageEvents.DELETE_GROUP_MEMBER, {
        conversationList,
        conversationId,
        phoneNumber,
        leaveGroup: true,
      }).then((resp) => {
        if (resp.status !== 'ok') {
          return addAlert({
            message: t('MESSAGES.FEEDBACK.LEAVE_GROUP_FAILED'),
            type: 'error',
          });
        }

        removeLocalConversation([conversationId]);
        sendSystemMessage({
          conversationId: conversationId,
          conversationList: conversationList,
          tgtPhoneNumber: '',
          is_system: true,
          system_number: '',
          system_type: 'leave',
        });
        return history.push('/messages');
      });
    },
    [addAlert, history, removeLocalConversation, sendSystemMessage, t],
  );

  return {
    sendMessage,
    deleteMessage,
    deleteConversation,
    addConversation,
    fetchMessages,
    sendEmbedMessage,
    setMessageRead,
    removeGroupMember,
    leaveGroup,
    sendSystemMessage,
    makeGroupOwner,
  };
};
