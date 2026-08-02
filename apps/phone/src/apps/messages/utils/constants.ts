import { Message, MessageConversation } from '@typings/messages';
import { ServerPromiseResp } from '@typings/common';

export const MockMessageConversations: MessageConversation[] = [
  {
    id: 1,
    conversationList: '111-1134+215-8139',
    participant: '111-1134',
    unreadCount: 12,
    label: '',
    updatedAt: 5,
    isGroupChat: false,
  },
  {
    id: 2,
    conversationList: '111-1134+321+215-8139',
    participant: '111-1134',
    unreadCount: 110,
    label: 'Secret Project Error chat',
    updatedAt: 5,
    isGroupChat: true,
  },
  {
    id: 3,
    conversationList: '111-1134+555-15196',
    participant: '111-1134',
    unreadCount: 2,
    label: '',
    updatedAt: 10,
    isGroupChat: false,
  },
];

const MockConversationMessagesById: Record<number, Message[]> = {
  1: [
    {
      id: 2,
      author: '215-8139',
      message: 'Dude',
      createdAt: 16234242422,
    },
    {
      id: 3,
      author: '111-1134',
      message: 'Bro, finish\nnotifications\napi?????',
      createdAt: 16234242423,
    },
    {
      id: 4,
      author: '444-4444',
      message: 'https://i.imgur.com/7juREyw.png',
      createdAt: 16234242424,
    },
    {
      id: 5,
      author: '111-1134',
      message: '',
      createdAt: 16234242425,
      is_embed: true,
      embed: JSON.stringify({
        type: 'audio',
        url: 'https://i.projecterror.dev/EZiezGo89KeMdVSxoTGpRb',
        phoneNumber: '111-1134',
      }),
    },
  ],
  2: [
    {
      id: 6,
      author: '215-8139',
      message: 'Did anyone test the latest build?',
      createdAt: 16234242430,
    },
    {
      id: 7,
      author: '321',
      message: 'Yeah, looks good on my end.',
      createdAt: 16234242431,
    },
    {
      id: 8,
      author: '111-1134',
      message: 'Ship it.',
      createdAt: 16234242432,
    },
  ],
  3: [
    {
      id: 9,
      author: '555-15196',
      message: 'Hey, you still coming to the meetup tonight?',
      createdAt: 16234242440,
    },
    {
      id: 10,
      author: '111-1134',
      message: 'Yeah, should be there around 8.',
      createdAt: 16234242441,
    },
    {
      id: 11,
      author: '555-15196',
      message: 'Perfect. See you then.',
      createdAt: 16234242442,
    },
  ],
};

export const getMockConversationServerResp = (
  conversationId: string | number,
): ServerPromiseResp<Message[]> => {
  const id = typeof conversationId === 'string' ? parseInt(conversationId, 10) : conversationId;

  return {
    data: MockConversationMessagesById[id] ?? [],
    status: 'ok',
  };
};
