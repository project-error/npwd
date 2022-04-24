import { ChannelItemProps, ChannelMessageProps } from '@typings/darkchat';
import { ServerPromiseResp } from '@typings/common';

export const MockChannels: ChannelItemProps[] = [
  {
    id: 1,
    label: 'wow',
    identifier: '123',
    lastMessage: 'uh oh',
  },
  {
    id: 2,
    label: 'acab',
    identifier: '123',
    lastMessage: 'uh oh',
  },
  {
    id: 3,
    label: 'wow2',
    identifier: '123',
    lastMessage: 'uh oh',
  },
];

export const MockChannelMessages: ChannelMessageProps[] = [
  {
    id: 1,
    message: 'Wow',
    isMine: false,
    createdAt: '2022-03-30 22:31:05',
  },
  {
    id: 2,
    message:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    isMine: true,
    createdAt: '2022-03-30 22:31:05',
  },
  {
    id: 3,
    message: 'I killed Taso',
    isMine: true,
    createdAt: '2022-03-30 22:31:05',
  },
  {
    id: 4,
    message: 'Good. I ate his dog',
    isMine: false,
    createdAt: '2022-03-30 22:31:05',
  },
];

export const MockChannelMessagesResp: ServerPromiseResp<ChannelMessageProps[]> = {
  data: MockChannelMessages,
  status: 'ok',
};
