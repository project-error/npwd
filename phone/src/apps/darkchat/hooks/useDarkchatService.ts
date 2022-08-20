import { useActiveDarkchatValue, useSetDarkchatMessagesState } from '../state/state';
import { useDarkchatActions } from './useDarkchatActions';
import { useNuiEvent } from '@common/hooks/useNuiEvent';
import {
  ChannelMessageProps,
  DarkchatEvents,
  OwnerTransferResp,
  UpdateLabelDto,
} from '@typings/darkchat';
import { useCallback } from 'react';

export const useDarkchatService = () => {
  const { addLocalMessage, updateLocalChannelLabel, localTransferOwner, leaveLocalChannel } =
    useDarkchatActions();
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

  const handleUpdateOwner = useCallback(
    (dto: OwnerTransferResp) => {
      localTransferOwner(dto);
    },
    [localTransferOwner],
  );

  const handleDeleteChannel = useCallback(
    (dto: { channelId: number }) => {
      console.log(dto);
      leaveLocalChannel(dto.channelId);
    },
    [leaveLocalChannel],
  );

  useNuiEvent('DARKCHAT', DarkchatEvents.BROADCAST_MESSAGE, handleUpdateMessages);
  useNuiEvent('DARKCHAT', DarkchatEvents.BROADCAST_LABEL_UPDATE, handleUpdateChannelLabel);
  useNuiEvent('DARKCHAT', DarkchatEvents.TRANSFER_OWNERSHIP_SUCCESS, handleUpdateOwner);
  useNuiEvent('DARKCHAT', DarkchatEvents.DELETE_CHANNEL_SUCCESS, handleDeleteChannel);
};
