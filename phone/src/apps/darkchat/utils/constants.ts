import { ChannelItemProps, ChannelMember, ChannelMessageProps } from '@typings/darkchat';
import { ServerPromiseResp } from '@typings/common';

export const MockChannels: ChannelItemProps[] = [
  {
    id: 1,
    label: 'wow',
    identifier: '123',
    lastMessage: 'uh oh',
    owner: '1234567',
  },
  {
    id: 2,
    label: 'acab',
    identifier: '123',
    lastMessage: 'uh oh',
    owner: '111-1134',
  },
  {
    id: 3,
    label: 'wow2',
    identifier: '123',
    lastMessage: 'uh oh',
    owner: '111-1134',
  },
];

export const MockChannelMembers: ChannelMember[] = [
  {
    phoneNumber: '23423',
    identifier: 'sklfjsdklfd',
    channelId: 2,
  },
  {
    phoneNumber: '5534542324',
    identifier: 'sdfaffsdf',
    channelId: 2,
  },
  {
    // me
    phoneNumber: '111-1134',
    identifier: 'iofjsdklafjdsfjklfjklas',
    channelId: 2,
  },
];

export const MockChannelMessages: ChannelMessageProps[] = [
  {
    id: 1,
    message: 'Wow',
    isMine: false,
    identifier: '234',
    createdAt: 1651357807,
    type: 'text',
  },
  {
    id: 2,
    message:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    isMine: true,
    createdAt: 1651357807,
    identifier: '234',
    type: 'text',
  },
  {
    id: 3,
    message: 'I killed Taso',
    isMine: true,
    identifier: '234',
    createdAt: 1651357807,
    type: 'text',
  },
  {
    id: 4,
    message: 'Good. I ate his dog',
    identifier: '234',
    isMine: false,
    createdAt: 1651357807,
    type: 'text',
  },
  {
    id: 5,
    message: 'https://i.redd.it/9suiibeiye091.jpg',
    identifier: '69',
    isMine: true,
    createdAt: 1651357807,
    type: 'image',
  },
];

export const MockChannelMessagesResp: ServerPromiseResp<ChannelMessageProps[]> = {
  data: MockChannelMessages,
  status: 'ok',
};
