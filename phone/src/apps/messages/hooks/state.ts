import { atom } from 'recoil';
import { CreateMessageGroupResult, Message, MessageGroup } from '../../../../../typings/messages';

export const messageState = {
  messageGroups: atom<MessageGroup[]>({
    key: 'messageGroups',
    default: [],
  }),
  messages: atom<Message[]>({
    key: 'messages',
    default: null,
  }),
  activeMessageGroup: atom<MessageGroup>({
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
