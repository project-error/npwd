import { Message, MessageConversation } from '../../../../../typings/messages';

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

export const MockConversationMessages: Message[] = [
  {
    id: 1,
    isMine: true,
    isRead: true,
    message: 'Hello',
    avatar: '',
    display: 'Chip',
    groupId: '4444+5555',
    phone_number: '111-1134',
    user_identifier: '4444',
  },
  {
    id: 2,
    isMine: false,
    isRead: true,
    message:
      'Hi asljdf klasdfjkasjdf sdfjf asdf djkjas k kksdfjjsl ks kldfs d fd asd asdfjasdjfjasdkljjfklasjldfjlj asdf sadfdsdkafjkljsdklfjklfjdf',
    avatar: '',
    display: 'Taso',
    groupId: '4444+5555',
    phone_number: '215-8139',
    user_identifier: '5555',
  },
];
