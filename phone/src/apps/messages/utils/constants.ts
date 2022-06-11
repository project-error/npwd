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
    createdBy: '111-1134',
  },
  {
    id: 2,
    conversationList: '423-43214+111-1134+444-4444+215-8139',
    participant: '111-1134',
    unread: 0,
    label: 'Secret Project Error chat',
    updatedAt: 5,
    isGroupChat: true,
    createdBy: '111-1134',
  },
];

const MockConversationMessages: Message[] = [
  {
    id: 4,
    author: '215-8139',
    message: 'Someone add sam!',
  },
  {
    id: 5,
    author: '444-4444',
    message: '',
    is_system: true,
    system_type: 'add',
    system_number: '423-43214',
  },
  {
    id: 6,
    author: '444-4444',
    message: 'I just added sam',
  },
  {
    id: 7,
    author: '423-43214',
    message: 'Hi Guys',
  },
  {
    id: 9,
    author: '111-1134',
    message: '',
    is_system: true,
    system_type: 'remove',
    system_number: '423-43214',
  },
  {
    id: 10,
    author: '215-8139',
    message: '',
    is_system: true,
    system_type: 'leave',
  },
];

export const MockConversationServerResp: ServerPromiseResp<Message[]> = {
  data: MockConversationMessages,
  status: 'ok',
};
