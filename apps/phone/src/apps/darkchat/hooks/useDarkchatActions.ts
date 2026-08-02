import {
  useSetActiveDarkchatState,
  useSetChannelsState,
  useSetDarkchatMembers,
  useSetDarkchatMessagesState,
} from '../state/state';
import { useCallback } from 'react';
import {
  ChannelItemProps,
  ChannelMember,
  ChannelMessageProps,
  OwnerTransferResp,
  UpdateLabelDto,
} from '@typings/darkchat';

interface DarkchatActionsProps {
  addLocalChannel: (channel: ChannelItemProps) => void;
  addLocalMessage: (message: ChannelMessageProps) => void;
  leaveLocalChannel: (id: number) => void;
  updateLocalChannelLabel: (dto: UpdateLabelDto) => void;
  localTransferOwner: (dto: OwnerTransferResp) => void;
  addLocalMembers: (members: ChannelMember[]) => void;
}

export const useDarkchatActions = (): DarkchatActionsProps => {
  const setChannels = useSetChannelsState();
  const setMessages = useSetDarkchatMessagesState();
  const setActiveChannel = useSetActiveDarkchatState();
  const setChatMembers = useSetDarkchatMembers();

  const addLocalChannel = useCallback(
    (channel: ChannelItemProps) => {
      setChannels((curVal) => [channel, ...curVal]);
    },
    [setChannels],
  );

  const leaveLocalChannel = useCallback(
    (id: number) => {
      setChannels((currVal) => [...currVal].filter((c) => c.id !== id));
    },
    [setChannels],
  );

  const addLocalMessage = useCallback(
    (message: ChannelMessageProps) => {
      setMessages((curVal) => [...curVal, message]);
    },
    [setMessages],
  );

  const addLocalMembers = useCallback(
    (members: ChannelMember[]) => {
      setChatMembers(members);
    },
    [setChatMembers],
  );

  const updateLocalChannelLabel = useCallback(
    (dto: UpdateLabelDto) => {
      setChannels((curVal) =>
        [...curVal].map((channel) => {
          if (dto.channelId === channel.id) {
            return {
              ...channel,
              label: dto.label,
            };
          }

          return channel;
        }),
      );
    },
    [setChannels],
  );

  const localTransferOwner = useCallback(
    (dto: OwnerTransferResp) => {
      setChannels((curVal) =>
        [...curVal].map((channel) => {
          if (dto.channelId === channel.id) {
            return {
              ...channel,
              owner: dto.ownerPhoneNumber,
            };
          }

          return channel;
        }),
      );

      setActiveChannel((curVal) => {
        if (!curVal || dto.channelId !== curVal.id) return curVal;

        return {
          ...curVal,
          owner: dto.ownerPhoneNumber,
        };
      });
    },
    [setActiveChannel, setChannels],
  );

  return {
    addLocalChannel,
    addLocalMessage,
    leaveLocalChannel,
    updateLocalChannelLabel,
    localTransferOwner,
    addLocalMembers,
  };
};
