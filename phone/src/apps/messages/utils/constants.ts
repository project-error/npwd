import { Message, MessageConversation } from '@typings/messages';
import { ServerPromiseResp } from '@typings/common';

export const MockMessageConversations: MessageConversation[] = [
  {
    conversation_id: '4444+5555',
    avatar: 'https://i.imgur.com/GCBVgXD.jpeg',
    phoneNumber: '215-8139',
    unread: 0,
    display: 'Taso',
  },
  {
    conversation_id: '4444+7777',
    avatar: '',
    phoneNumber: '4355345',
    unread: 3,
    display: 'Rocky',
  },
];

const MockConversationMessages: Message[] = [
  {
    id: 1,
    author: '215-8139',
    message: 'Hello',
    conversation_id: '4444+5555',
  },
  {
    id: 2,
    author: '215-8139',
    message:
      'Hi asljdf klasdfjkasjdf sdfjf asdf djkjas k kksdfjjsl ks kldfs d fd asd asdfjasdjfjasdkljjfklasjldfjlj asdf sadfdsdkafjkljsdklfjklfjdf',
  },
  {
    id: 1,
    author: '215-8139',
    message: 'Hello',
    conversation_id: '4444+5555',
  },
  {
    id: 3,
    author: '215-8139',
    message: 'Hello Rocky',
    conversation_id: '4444+7777',
  },
];

export const MockConversationServerResp: ServerPromiseResp<Message[]> = {
  data: MockConversationMessages,
  status: 'ok',
};
