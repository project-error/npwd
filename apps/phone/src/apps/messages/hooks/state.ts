import { useMemo } from 'react';
import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';
import { CreateMessageGroupResult, Message, MessageConversation, MessageEvents } from '@typings/messages';
import { buildRespObj, isEnvBrowser } from '@utils/misc';
import { MockMessageConversations } from '../utils/constants';
import { Contact } from '@typings/contact';
import { fetchNuiData } from '@common/query/fetch-nui-query';
import { useQueryState, useQueryStateValue, useSetQueryState } from '@common/query/query-state';
import { useContactsValue } from '../../contacts/hooks/state';

export const MESSAGE_CONVERSATIONS_QUERY_KEY = ['messages', 'conversations'] as const;
export const MESSAGES_QUERY_KEY = ['messages', 'active-thread'] as const;

const fetchConversations = async () => {
  try {
    return await fetchNuiData<MessageConversation[]>(
      MessageEvents.FETCH_MESSAGE_CONVERSATIONS,
      undefined,
      buildRespObj(MockMessageConversations),
    );
  } catch (e) {
    if (isEnvBrowser()) {
      return MockMessageConversations;
    }

    console.error(e);
    return [];
  }
};

const currentGroupId = atom<number | null>(null);

export const messageState = {
  messageCoversations: MESSAGE_CONVERSATIONS_QUERY_KEY,
  filterValue: atom<string>(''),
  messages: MESSAGES_QUERY_KEY,
  activeMessageConversation: atom<MessageConversation | null>(null),
  showNewMessageGroup: atom<boolean>(false),
  createMessageGroupResult: atom<CreateMessageGroupResult>(null),
  imageModal: atom<boolean>(false),
  unreadMessagesCount: atom<number>(0),
  selectedMessage: atom<Message>(null),
  checkedConversations: atom<number[]>([]),
  isEditing: atom<boolean>(false),
};

export const useMessageConversationsValue = () =>
  useQueryStateValue<MessageConversation[]>(
    MESSAGE_CONVERSATIONS_QUERY_KEY,
    fetchConversations,
    [],
  );
export const useSetMessageConversations = () =>
  useSetQueryState<MessageConversation[]>(MESSAGE_CONVERSATIONS_QUERY_KEY, []);
export const useMessageConversations = () =>
  useQueryState<MessageConversation[]>(MESSAGE_CONVERSATIONS_QUERY_KEY, fetchConversations, []);

export const useMessagesState = () =>
  useQueryState<Message[]>(MESSAGES_QUERY_KEY, async () => [], []);
export const useMessagesValue = () => useQueryStateValue<Message[]>(MESSAGES_QUERY_KEY, async () => [], []);
export const useSetMessages = () => useSetQueryState<Message[]>(MESSAGES_QUERY_KEY, []);

export const useActiveMessageConversation = () =>
  useAtomValue(messageState.activeMessageConversation);

export const useSetActiveMessageConversation = () =>
  useSetAtom(messageState.activeMessageConversation);

export const useSetConversationId = () => useSetAtom(currentGroupId);
export const useConversationId = () => useAtomValue(currentGroupId);

export const useFilterValueState = () => useAtom(messageState.filterValue);
export const useSetFilterValue = () => useSetAtom(messageState.filterValue);

export const useFilteredConversationsValue = () => {
  const filterValue = useAtomValue(messageState.filterValue);
  const messageConversations = useMessageConversationsValue();
  const contactsValue: Contact[] = useContactsValue();

  return useMemo(() => {
    if (!filterValue) return messageConversations;

    const searchRegex = new RegExp(filterValue, 'i');

    return messageConversations.filter((messageConversation) => {
      for (const contact of contactsValue) {
        if (
          searchRegex.test(contact.display) &&
          messageConversation.conversationList.includes(contact.number)
        )
          return true;
      }

      return searchRegex.test(messageConversation.label);
    });
  }, [contactsValue, filterValue, messageConversations]);
};

export const useSetSelectedMessage = () => useSetAtom(messageState.selectedMessage);
export const useSelectedMessageValue = () => useAtomValue(messageState.selectedMessage);

export const useCheckedConversations = () => useAtom(messageState.checkedConversations);
export const useCheckedConversationsValue = () => useAtomValue(messageState.checkedConversations);

export const useIsEditing = () => useAtom(messageState.isEditing);
export const useIsEditingValue = () => useAtomValue(messageState.isEditing);
