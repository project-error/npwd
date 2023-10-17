import { useNuiEvent } from 'fivem-nui-react-lib';
import { Message, MessageConversation, MessageEvents } from '@typings/messages';
import { useMessageActions } from './useMessageActions';
import { useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useActiveMessageConversation } from './state';
import { usePhoneVisibility } from '@os/phone/hooks';
import { useNotification } from '@os/new-notifications/useNotification';
import { useContactActions } from '@apps/contacts/hooks/useContactActions';
import useMessages from './useMessages';

export const useMessagesService = () => {
  const { updateLocalMessages, updateLocalConversations, setMessageReadState } =
    useMessageActions();
  const { pathname } = useLocation();
  const activeConversation = useActiveMessageConversation();
  const { visibility } = usePhoneVisibility();
  const { enqueueNotification } = useNotification();
  const { getDisplayByNumber } = useContactActions();
  const { getMessageConversationById, goToConversation } = useMessages();

  const addNotification = useCallback(
    (message: string, convName: string, convId: number) => {
      const group = getMessageConversationById(convId);

      enqueueNotification({
        appId: 'MESSAGES',
        notisId: 'npwd:messages:messageBroadcast',
        content: message,
        onClick: () => goToConversation(group),
        secondaryTitle: getDisplayByNumber(convName) ?? convName,
        path: `/messages/conversations/${convId}`,
      });
    },
    [enqueueNotification],
  );

  const handleMessageBroadcast = ({ conversationName, conversation_id, message }) => {
    if (visibility && pathname.includes(`/messages/conversations/${conversation_id}`)) {
      return;
    }
    
    setMessageReadState(conversation_id, 1);
    // Set the current unread count to 1, when they click it will be removed
    addNotification(message, conversationName, conversation_id);
  };

  // This is only called for the receiver of the message. We'll be using the standardized pattern for the transmitter.
  const handleUpdateMessages = useCallback(
    (messageDto: Message) => {
      if (messageDto.conversation_id !== activeConversation?.id) return;

      updateLocalMessages(messageDto);
    },
    [updateLocalMessages, activeConversation],
  );

  const handleAddConversation = useCallback(
    (conversation: MessageConversation) => {
      updateLocalConversations({
        participant: conversation.participant,
        isGroupChat: conversation.isGroupChat,
        id: conversation.id,
        conversationList: conversation.conversationList,
        label: conversation.label,
        unread: 0,
      });
    },
    [updateLocalConversations],
  );

  useNuiEvent('MESSAGES', MessageEvents.CREATE_MESSAGE_BROADCAST, handleMessageBroadcast);
  useNuiEvent('MESSAGES', MessageEvents.SEND_MESSAGE_SUCCESS, handleUpdateMessages);
  useNuiEvent('MESSAGES', MessageEvents.CREATE_MESSAGE_CONVERSATION_SUCCESS, handleAddConversation);
};
