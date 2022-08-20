import { atom, selector, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import {
  ChannelItemProps,
  ChannelMember,
  ChannelMessageProps,
  DarkchatEvents,
} from '@typings/darkchat';
import fetchNui from '@utils/fetchNui';
import { MockChannelMembers, MockChannels } from '../utils/constants';
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
            DarkchatEvents.FETCH_CHANNELS,
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
  members: atom<ChannelMember[]>({
    key: 'darkchatMembers',
    default: null,
  }),
  darkChatMessages: atom<ChannelMessageProps[]>({
    key: 'darkChatMessages',
    default: [],
  }),
  activeConversation: atom<ChannelItemProps>({
    key: 'darkChatActiveConversation',
    default: null,
  }),
  showUploadMediaModal: atom<boolean>({
    key: 'darkChatShowUploadModal',
    default: false,
  }),
  showOwnerModal: atom<boolean>({
    key: 'darkChatShowOwnerModal',
    default: false,
  }),
  modalMedia: atom<string>({
    key: 'darkChatModalMedia',
    default: '',
  }),
};

export const useChannelsValue = () => useRecoilValue(darkChatState.channels);
export const useSetChannelsState = () => useSetRecoilState(darkChatState.channels);

export const useActiveDarkchatValue = () =>
  useRecoilValue<ChannelItemProps>(darkChatState.activeConversation);
export const useSetActiveDarkchatState = () => useSetRecoilState(darkChatState.activeConversation);
export const useActiveDarkchatState = () => useRecoilState(darkChatState.activeConversation);

export const useDarkchatMessagesValue = () =>
  useRecoilValue<ChannelMessageProps[]>(darkChatState.darkChatMessages);
export const useSetDarkchatMessagesState = () => useSetRecoilState(darkChatState.darkChatMessages);
export const useDarkchatMessagesState = () => useRecoilState(darkChatState.darkChatMessages);

export const useDarkchatMembersValue = () => useRecoilValue<ChannelMember[]>(darkChatState.members);
export const useSetDarkchatMembers = () => useSetRecoilState(darkChatState.members);
