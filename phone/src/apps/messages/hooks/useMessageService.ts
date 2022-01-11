import { useNuiEvent } from 'fivem-nui-react-lib';
import { Message, MessageConversationResponse, MessageEvents } from '@typings/messages';
import { useMessageActions } from './useMessageActions';
import { useCallback } from 'react';
import { useMessageNotifications } from './useMessageNotifications';
import { useLocation } from 'react-router';
import { usePhoneVisibility } from '@os/phone/hooks/usePhoneVisibility';
import { useContactActions } from '../../contacts/hooks/useContactActions';

export const useMessagesService = () => {
  const { updateLocalMessages, updateLocalConversations, setMessageReadState } =
    useMessageActions();
  const { setNotification } = useMessageNotifications();
  const { pathname } = useLocation();
  const { visibility } = usePhoneVisibility();
  const { getDisplayByNumber, getPictureByNumber } = useContactActions();

  const handleMessageBroadcast = ({ conversationName, conversationId, message }) => {
    if (visibility && pathname.includes('/messages/conversations')) {
      return;
    }

    // Set the current unread count to 1, when they click it will be removed
    setMessageReadState(conversationId, 1);
    setNotification({ conversationName, conversationId, message });
  };

  // This is only called for the receiver of the message. We'll be using the standardized pattern for the transmitter.
  const handleUpdateMessages = useCallback(
    (messageDto: Message) => {
      updateLocalMessages(messageDto);
    },
    [updateLocalMessages],
  );

  const handleAddConversation = useCallback(
    (conversation: MessageConversationResponse) => {
      const display = getDisplayByNumber(conversation.phoneNumber);
      const avatar = getPictureByNumber(conversation.phoneNumber);

      updateLocalConversations({
        phoneNumber: conversation.phoneNumber,
        conversation_id: conversation.conversation_id,
        updatedAt: conversation.updatedAt,
        avatar,
        unread: 0,
        display,
      });
    },
    [updateLocalConversations, getDisplayByNumber, getPictureByNumber],
  );

  useNuiEvent('MESSAGES', MessageEvents.CREATE_MESSAGE_BROADCAST, handleMessageBroadcast);
  useNuiEvent('MESSAGES', MessageEvents.SEND_MESSAGE_SUCCESS, handleUpdateMessages);
  useNuiEvent('MESSAGES', MessageEvents.CREATE_MESSAGE_CONVERSATION_SUCCESS, handleAddConversation);
};
