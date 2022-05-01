export interface ChannelItemProps {
  id: number;
  label: string;
  identifier: string;
  lastMessage?: string;
}

// TODO: images
export interface RawChannelMessageProps {
  id: number;
  message: string;
  identifier: string;
  createdAt: string;
}

export interface ChannelMessageProps {
  id: number;
  message: string;
  identifier: string;
  createdAt: number;
  isMine: boolean;
  channelId?: number;
}

export type JoinChannelDTO = {
  channelIdentifier: string;
  label?: string;
};

export type MessageDTO = {
  channelId: number;
  phoneNumber: string;
  message: string;
};

export type ChannelMember = {
  channelId: string;
  identifier: string;
};

export enum DarkchatEvents {
  ADD_CHANNEL = 'npwd:darkchatAddChannel',
  FETCH_MESSAGES = 'npwd:darkchatFetchMessages',
  FETCH_CHANNELS = 'npwd:darkchatFetchChannels',
  BROADCAST_MESSAGE = 'npwd:darkchatBroadcastMessage',
  SEND_MESSAGE = 'npwd:darkchatSendMessage',
}
