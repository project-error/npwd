import {
  darkChatState,
  useSetActiveDarkchatState,
  useSetChannelsState,
  useSetDarkchatMembers,
  useSetDarkchatMessagesState,
} from '../state/state';
import { useRecoilCallback } from 'recoil';
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

  const addLocalChannel = useRecoilCallback<[ChannelItemProps], void>(
    ({ snapshot }) =>
      async (channel) => {
        const { state } = await snapshot.getLoadable(darkChatState.channels);

        if (state !== 'hasValue') return null;
        setChannels((curVal) => [channel, ...curVal]);
      },
    [],
  );

  const leaveLocalChannel = useRecoilCallback<[number], void>(
    ({ snapshot }) =>
      async (id) => {
        const { state } = await snapshot.getLoadable(darkChatState.channels);

        if (state !== 'hasValue') return null;
        setChannels((currVal) => [...currVal].filter((c) => c.id !== id));
      },
    [],
  );

  const addLocalMessage = useRecoilCallback<[ChannelMessageProps], void>(
    ({ snapshot }) =>
      async (message) => {
        const { state } = await snapshot.getLoadable(darkChatState.darkChatMessages);

        if (state !== 'hasValue') return null;
        setMessages((curVal) => [...curVal, message]);
      },
  );

  const addLocalMembers = useRecoilCallback<[ChannelMember[]], void>(
    ({ snapshot }) =>
      async (members) => {
        const { state } = await snapshot.getLoadable(darkChatState.members);
        if (state !== 'hasValue') return null;
        setChatMembers(members);
      },
  );

  const updateLocalChannelLabel = useRecoilCallback<[UpdateLabelDto], void>(
    ({ snapshot }) =>
      async (dto) => {
        const { state } = await snapshot.getLoadable(darkChatState.channels);

        if (state !== 'hasValue') return null;
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
  );

  const localTransferOwner = useRecoilCallback<[OwnerTransferResp], void>(
    ({ snapshot }) =>
      async (dto) => {
        const { state } = await snapshot.getLoadable(darkChatState.channels);
        if (state !== 'hasValue') return null;

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

        setActiveChannel((curVal) =>
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
      },
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
