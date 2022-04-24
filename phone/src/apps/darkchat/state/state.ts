import { atom, selector, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { ChannelItemProps } from '@typings/darkchat';
import fetchNui from '@utils/fetchNui';
import { MockChannels } from '../utils/constants';
import { ServerPromiseResp } from '@typings/common';
import { buildRespObj } from '@utils/misc';

export const darkChatState = {
  channels: atom<ChannelItemProps[]>({
    key: 'darkchatChannels',
    default: selector({
      key: 'defaultDarkchatChannels',
      get: async () => {
        try {
          // TODO: Enum for this
          const res = await fetchNui<ServerPromiseResp<ChannelItemProps[]>>(
            'safsdfa',
            undefined,
            buildRespObj(MockChannels),
          );

          return res.data;
        } catch (err) {
          console.error(err);
          return [];
        }
      },
    }),
  }),
  darkChatMessages: atom({
    key: 'darkChatMessages',
    default: [],
  }),
  activeConversation: atom<ChannelItemProps>({
    key: 'darkChatActiveConversation',
    default: null,
  }),
};

export const useChannelsValue = () => useRecoilValue(darkChatState.channels);
export const useSetChannelsState = () => useSetRecoilState(darkChatState.channels);

export const useActiveDarkchatValue = () => useRecoilValue(darkChatState.activeConversation);
export const useSetActiveDarkchatState = () => useSetRecoilState(darkChatState.activeConversation);
export const useActiveDarkchatState = () => useRecoilState(darkChatState.activeConversation);

export const useDarkchatMessagesValue = () => useRecoilValue(darkChatState.darkChatMessages);
export const useSetDarkchatMessagesState = () => useSetRecoilState(darkChatState.darkChatMessages);
export const useDarkchatMessagesState = () => useRecoilState(darkChatState.darkChatMessages);
