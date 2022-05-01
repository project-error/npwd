import { useActiveDarkchatValue, useSetDarkchatMessagesState } from '../state/state';
import { useDarkchatActions } from './useDarkchatActions';
import { useNuiEvent } from '@common/hooks/useNuiEvent';
import { ChannelMessageProps, DarkchatEvents } from '@typings/darkchat';
import { useCallback } from 'react';

export const useDarkchatService = () => {
  const { addLocalMessage } = useDarkchatActions();
  const activeConversation = useActiveDarkchatValue();

  const handleUpdateMessages = useCallback(
    (message: ChannelMessageProps) => {
      if (activeConversation.id === message.channelId) {
        addLocalMessage(message);
      }
    },
    [activeConversation, addLocalMessage],
  );

  useNuiEvent('DARKCHAT', DarkchatEvents.BROADCAST_MESSAGE, handleUpdateMessages);
};
