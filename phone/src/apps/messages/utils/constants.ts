import { Message, MessageConversation } from '@typings/messages';
import { ServerPromiseResp } from '@typings/common';

export const MockMessageConversations: MessageConversation[] = [
  {
    conversation_id: '4444+5555',
    avatar: 'https://i.imgur.com/GCBVgXD.jpeg',
    phoneNumber: '215-8139',
    unread: 0,
    display: 'Taso',
    updatedAt: 5,
  },
  {
    conversation_id: '4444+7777',
    avatar: '',
    phoneNumber: '603-275-8373',
    unread: 3,
    display: 'Chip',
    updatedAt: 15,
  },
  {
    conversation_id: '3333+5555',
    avatar: '',
    phoneNumber: '555-15196',
    unread: 3,
    display: 'Rocko',
    updatedAt: 5,
  },
  {
    conversation_id: '2222+1111',
    avatar: '',
    phoneNumber: '444-4444',
    unread: 3,
    display: 'Kidz',
    updatedAt: 7,
  },
];

const MockConversationMessages: Message[] = [
  {
    id: 1,
    author: '215-8139',
    message: '',
    conversation_id: '4444+5555',
  },
  {
    id: 2,
    author: '215-8139',
    message:
      'Hi asljdf klasdfjkasjdf sdfjf asdf djkjas k kksdfjjsl ks kldfs d fd asd asdfjasdjfjasdkljjfklasjldfjlj asdf sadfdsdkafjkljsdklfjklfjdf',
  },
  {
    id: 3,
    author: '215-8139',
    message: 'Hello',
    conversation_id: '4444+5555',
  },
  {
    id: 5,
    author: '215-8139',
    message: 'https://i.tasoagc.dev/LtuA.png',
  },
];

export const MockConversationServerResp: ServerPromiseResp<Message[]> = {
  data: MockConversationMessages,
  status: 'ok',
};
