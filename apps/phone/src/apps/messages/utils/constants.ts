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
  },
  {
    id: 2,
    conversationList: '111-1134+321+215-8139',
    participant: '111-1134',
    unread: 0,
    label: 'Secret Project Error chat',
    updatedAt: 5,
    isGroupChat: true,
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
    message: 'Bro, finish\nnotifications\napi?????',
    createdAt: 16234242422,
  },
  {
    id: 4,
    author: '444-4444',
    message: 'https://i.imgur.com/7juREyw.png',
    createdAt: 16234242422,
  },
  {
    id: 5,
    author: '111-1134',
    message: '',
    createdAt: 16234242422,
    is_embed: true,
    embed: JSON.stringify({
      type: 'audio',
      url: 'https://i.projecterror.dev/EZiezGo89KeMdVSxoTGpRb',
      phoneNumber: '111-1134',
    }),
  },
];

export const MockConversationServerResp: ServerPromiseResp<Message[]> = {
  data: MockConversationMessages,
  status: 'ok',
};
