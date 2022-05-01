import { darkChatState, useSetChannelsState, useSetDarkchatMessagesState } from '../state/state';
import { useRecoilCallback } from 'recoil';
import { ChannelItemProps, ChannelMessageProps } from '@typings/darkchat';

interface DarkchatActionsProps {
  addLocalChannel: (channel: ChannelItemProps) => void;
  addLocalMessage: (message: ChannelMessageProps) => void;
}

export const useDarkchatActions = (): DarkchatActionsProps => {
  const setChannels = useSetChannelsState();
  const setMessages = useSetDarkchatMessagesState();

  const addLocalChannel = useRecoilCallback<[ChannelItemProps], void>(
    ({ snapshot }) =>
      async (channel) => {
        const { state } = await snapshot.getLoadable(darkChatState.channels);

        if (state !== 'hasValue') return null;
        setChannels((curVal) => [channel, ...curVal]);
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

  return {
    addLocalChannel,
    addLocalMessage,
  };
};
