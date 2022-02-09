import { Message, MessageConversation } from '@typings/messages';
import { ServerPromiseResp } from '@typings/common';

export const MockMessageConversations: MessageConversation[] = [
  {
    id: 1,
    conversationList: '123+321',
    participant: '123',
    unread: 0,
    label: 'Cool thihngs',
    updatedAt: 5,
  },
];

const MockConversationMessages: Message[] = [
  {
    id: 1,
    author: '215-8139',
    message: '',
    conversation_id: 1,
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
    conversation_id: 1,
  },
];

export const MockConversationServerResp: ServerPromiseResp<Message[]> = {
  data: MockConversationMessages,
  status: 'ok',
};
