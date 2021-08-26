import { atom, selector, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import {
  CreateMessageGroupResult,
  Message,
  MessageConversation,
  MessageEvents,
} from '../../../../../typings/messages';
import { fetchNui } from '../../../utils/fetchNui';
import { ServerPromiseResp } from '../../../../../typings/common';
import LogDebugEvent from '../../../os/debug/LogDebugEvents';
import { isEnvBrowser } from '../../../utils/misc';
import { MockConversationMessages, MockMessageConversations } from '../utils/constants';

const currentGroupId = atom({ key: 'currentGroupId', default: null });

export const messageState = {
  messageCoversations: atom<MessageConversation[]>({
    key: 'messageConversations',
    default: selector({
      key: 'defaultMessageConversation',
      get: async () => {
        try {
          const resp = await fetchNui<ServerPromiseResp<MessageConversation[]>>(
            MessageEvents.FETCH_MESSAGE_CONVERSATIONS,
          );
          LogDebugEvent({ action: 'fetchMessageConversation', data: resp.data });
          return resp.data;
        } catch (e) {
          if (isEnvBrowser()) {
            return MockMessageConversations;
          }
          console.error(e);
          return [];
        }
      },
    }),
  }),
  filterValue: atom<string>({
    key: 'defaultFilterValue',
    default: '',
  }),
  filteredMessageConversations: selector<MessageConversation[]>({
    key: 'defaultFilteredMessageConversations',
    get: ({ get }) => {
      const searchValue: string = get(messageState.filterValue);
      const messageConversations: MessageConversation[] = get(messageState.messageCoversations);

      if (!searchValue) return messageConversations; // added this

      const regExp = new RegExp(searchValue, 'gi');

      return messageConversations.filter(
        (conversation) =>
          conversation.display.match(regExp) || conversation.phoneNumber.match(regExp),
      );
    },
  }),
  messages: atom<Message[]>({
    key: 'messages',
    default: selector({
      key: 'defaultMessages',
      get: async ({ get }) => {
        try {
          const groupId = get(currentGroupId);
          const resp = await fetchNui(MessageEvents.FETCH_MESSAGES, { conversationId: groupId });
          LogDebugEvent({ action: 'fetchMessages', data: resp.data[0], level: 5 });
          return resp.data;
        } catch (e) {
          if (isEnvBrowser()) {
            return MockConversationMessages;
          }
          console.error(e);
          return [];
        }
      },
    }),
  }),
  activeMessageConversation: atom<MessageConversation>({
    key: 'activeMessageGroup',
    default: MockMessageConversations[0],
  }),
  showNewMessageGroup: atom<boolean>({
    key: 'showNewMessageGroup',
    default: false,
  }),
  createMessageGroupResult: atom<CreateMessageGroupResult>({
    key: 'createMessageGroupResult',
    default: null,
  }),
  imageModal: atom<boolean>({
    key: 'useImageModal',
    default: false,
  }),
  unreadMessagesCount: atom<number>({
    key: 'unreadMessagesCount',
    default: 0,
  }),
};

export const useMessageConversationValue = () => useRecoilValue(messageState.messageCoversations);
export const useSetMessageConversation = () => useSetRecoilState(messageState.messageCoversations);
export const useMessageConversation = () => useRecoilState(messageState.messageCoversations);

export const useMessagesState = () => useRecoilState(messageState.messages);
export const useMessagesValue = () => useRecoilValue(messageState.messages);
export const useSetMessages = () => useSetRecoilState(messageState.messages);

export const useActiveMessageConversation = () =>
  useRecoilValue(messageState.activeMessageConversation);

export const useSetConversationId = () => useSetRecoilState(currentGroupId);

export const useFilterValueState = () => useRecoilState(messageState.filterValue);
export const useSetFilterValue = () => useSetRecoilState(messageState.filterValue);

export const useFilteredConversationsValue = () =>
  useRecoilValue(messageState.filteredMessageConversations);
