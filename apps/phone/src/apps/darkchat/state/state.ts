import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';
import {
  ChannelItemProps,
  ChannelMember,
  ChannelMessageProps,
  DarkchatEvents,
} from '@typings/darkchat';
import { MockChannelMembers, MockChannels } from '../utils/constants';
import { buildRespObj } from '@utils/misc';
import { fetchNuiData } from '@common/query/fetch-nui-query';
import { useQueryState, useQueryStateValue, useSetQueryState } from '@common/query/query-state';

export const DARKCHAT_CHANNELS_QUERY_KEY = ['darkchat', 'channels'] as const;
export const DARKCHAT_MESSAGES_QUERY_KEY = ['darkchat', 'messages', 'active'] as const;
export const DARKCHAT_MEMBERS_QUERY_KEY = ['darkchat', 'members', 'active'] as const;

const fetchChannels = () =>
  fetchNuiData<ChannelItemProps[]>(
    DarkchatEvents.FETCH_CHANNELS,
    undefined,
    buildRespObj(MockChannels),
  ).catch((err) => {
    console.error(err);
    return [];
  });

export const darkChatState = {
  channels: DARKCHAT_CHANNELS_QUERY_KEY,
  members: DARKCHAT_MEMBERS_QUERY_KEY,
  darkChatMessages: DARKCHAT_MESSAGES_QUERY_KEY,
  activeConversation: atom<ChannelItemProps>(null),
  showUploadMediaModal: atom<boolean>(false),
  showOwnerModal: atom<boolean>(false),
  modalMedia: atom<string>(''),
};

export const useChannelsValue = () =>
  useQueryStateValue<ChannelItemProps[]>(DARKCHAT_CHANNELS_QUERY_KEY, fetchChannels, []);
export const useSetChannelsState = () =>
  useSetQueryState<ChannelItemProps[]>(DARKCHAT_CHANNELS_QUERY_KEY, []);

export const useActiveDarkchatValue = () =>
  useAtomValue(darkChatState.activeConversation);
export const useSetActiveDarkchatState = () => useSetAtom(darkChatState.activeConversation);
export const useActiveDarkchatState = () => useAtom(darkChatState.activeConversation);

export const useDarkchatMessagesValue = () =>
  useQueryStateValue<ChannelMessageProps[]>(DARKCHAT_MESSAGES_QUERY_KEY, async () => [], []);
export const useSetDarkchatMessagesState = () =>
  useSetQueryState<ChannelMessageProps[]>(DARKCHAT_MESSAGES_QUERY_KEY, []);
export const useDarkchatMessagesState = () =>
  useQueryState<ChannelMessageProps[]>(DARKCHAT_MESSAGES_QUERY_KEY, async () => [], []);

export const useDarkchatMembersValue = () =>
  useQueryStateValue<ChannelMember[]>(DARKCHAT_MEMBERS_QUERY_KEY, async () => MockChannelMembers, []);
export const useSetDarkchatMembers = () =>
  useSetQueryState<ChannelMember[]>(DARKCHAT_MEMBERS_QUERY_KEY, []);
