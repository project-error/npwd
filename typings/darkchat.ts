export interface ChannelItemProps {
  id: number;
  label: string;
  identifier: string;
  lastMessage?: string;
  owner?: string;
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
  isOwner: boolean;
  channelId: string;
  identifier: string;
};

export type UpdateLabelDto = {
  channelId: number;
  label: string;
};

export enum DarkchatEvents {
  ADD_CHANNEL = 'npwd:darkchatAddChannel',
  LEAVE_CHANNEL = 'npwd:darkchatLeaveChannel',
  FETCH_MESSAGES = 'npwd:darkchatFetchMessages',
  FETCH_CHANNELS = 'npwd:darkchatFetchChannels',
  BROADCAST_MESSAGE = 'npwd:darkchatBroadcastMessage',
  BROADCAST_LABEL_UPDATE = 'npwd:darkchatBroadcastLabelUpdate',
  SEND_MESSAGE = 'npwd:darkchatSendMessage',
  UPDATE_CHANNEL_LABEL = 'npwd:darkchatUpdateChannelLabel',
}
