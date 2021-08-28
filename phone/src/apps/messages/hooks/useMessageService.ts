import { useNuiEvent } from 'fivem-nui-react-lib';
import { MessageEvents, PreDBMessage } from '../../../../../typings/messages';
import { useMessageActions } from './useMessageActions';
import { useCallback } from 'react';

export const useMessagesService = () => {
  const { handleBroadcast, updateMessages } = useMessageActions();

  const handleMessageBroadcast = useCallback(
    ({ conversationName, conversationId, message }) => {
      handleBroadcast({ conversationName, conversationId, message });
    },
    [handleBroadcast],
  );

  // This is only called for the receiver of the message. We'll be using the standardized pattern for the transmitter.
  const handleUpdateMessages = useCallback(
    (messageDto: PreDBMessage) => {
      updateMessages(messageDto);
    },
    [updateMessages],
  );

  useNuiEvent('MESSAGES', MessageEvents.CREATE_MESSAGE_BROADCAST, handleMessageBroadcast);
  useNuiEvent('MESSAGES', MessageEvents.SEND_MESSAGE_SUCCESS, handleUpdateMessages);
};
