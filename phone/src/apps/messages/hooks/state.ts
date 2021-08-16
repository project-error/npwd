import { atom, selector } from 'recoil';
import {
  CreateMessageGroupResult,
  Message,
  MessageConversation,
  MessageEvents,
  MessageGroup,
} from '../../../../../typings/messages';
import { fetchNui } from '../../../utils/fetchNui';
import { ServerPromiseResp } from '../../../../../typings/common';
import LogDebugEvent from '../../../os/debug/LogDebugEvents';
import { isEnvBrowser } from '../../../utils/misc';

export const messageState = {
  messageGroups: atom<MessageConversation[]>({
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
            return 'somthing';
          }
          console.error(e);
          return [];
        }
      },
    }),
  }),
  messages: atom<Message[]>({
    key: 'messages',
    default: null,
  }),
  activeMessageGroup: atom<MessageConversation>({
    key: 'activeMessageGroup',
    default: null,
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
