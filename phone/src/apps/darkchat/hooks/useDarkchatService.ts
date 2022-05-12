import { useActiveDarkchatValue, useSetDarkchatMessagesState } from '../state/state';
import { useDarkchatActions } from './useDarkchatActions';
import { useNuiEvent } from '@common/hooks/useNuiEvent';
import { ChannelMessageProps, DarkchatEvents, UpdateLabelDto } from '@typings/darkchat';
import { useCallback } from 'react';

export const useDarkchatService = () => {
  const { addLocalMessage, updateLocalChannelLabel } = useDarkchatActions();
  const activeConversation = useActiveDarkchatValue();

  const handleUpdateMessages = useCallback(
    (message: ChannelMessageProps) => {
      if (activeConversation.id === message.channelId) {
        addLocalMessage(message);
      }
    },
    [activeConversation, addLocalMessage],
  );

  const handleUpdateChannelLabel = useCallback(
    (dto: UpdateLabelDto) => {
      if (activeConversation.id === dto.channelId) {
        updateLocalChannelLabel(dto);
      }
    },
    [activeConversation, addLocalMessage],
  );

  useNuiEvent('DARKCHAT', DarkchatEvents.BROADCAST_MESSAGE, handleUpdateMessages);
  useNuiEvent('DARKCHAT', DarkchatEvents.BROADCAST_LABEL_UPDATE, handleUpdateChannelLabel);
};
