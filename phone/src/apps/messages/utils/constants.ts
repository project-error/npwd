import { Message, MessageConversation } from '@typings/messages';
import { ServerPromiseResp } from '@typings/common';

export const MockMessageConversations: MessageConversation[] = [
  {
    id: 1,
    conversationList: '111-1134+215-8139',
    participant: '111-1134',
    unread: 0,
    label: '',
    updatedAt: 5,
    isGroupChat: false,
    owner: '111-1134',
  },
  {
    id: 2,
    conversationList: '111-1134+222-4325+215-8139',
    participant: '111-1134',
    unread: 0,
    label: 'Secret Project Error chat',
    updatedAt: 5,
    isGroupChat: true,
    owner: '222-4325',
    avatar: 'http://i.tasoagc.dev/2QYV',
  },
  {
    id: 3,
    conversationList: '111-1134+444-4444',
    participant: '111-1134',
    unread: 0,
    label: '',
    updatedAt: 5,
    isGroupChat: false,
    owner: '111-1134',
  },
];

const MockConversationMessages: Message[] = [
  {
    id: 2,
    author: '215-8139',
    message: 'Dude, when is this rewrite done?????',
    createdAt: 16234242422,
  },
  {
    id: 3,
    author: '111-1134',
    message: 'Bro, finish notifications api?????',
    createdAt: 16234242422,
  },
  {
    id: 4,
    author: '444-4444',
    message: "Couldn't be me!",
    createdAt: 16234242422,
  },
];

export const MockConversationServerResp: ServerPromiseResp<Message[]> = {
  data: MockConversationMessages,
  status: 'ok',
};
