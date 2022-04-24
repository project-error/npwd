import { darkChatState, useSetChannelsState } from '../state/state';
import { useRecoilCallback } from 'recoil';
import { ChannelItemProps } from '@typings/darkchat';

interface DarkchatActionsProps {
  addLocalChannel: (channel: ChannelItemProps) => void;
}

export const useDarkchatActions = (): DarkchatActionsProps => {
  const setChannels = useSetChannelsState();

  const addLocalChannel = useRecoilCallback<[ChannelItemProps], void>(
    ({ snapshot }) =>
      async (channel) => {
        const { state } = await snapshot.getLoadable(darkChatState.channels);

        if (state !== 'hasValue') return null;
        setChannels((curVal) => [channel, ...curVal]);
      },
    [],
  );

  return {
    addLocalChannel,
  };
};
