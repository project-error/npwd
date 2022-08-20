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
  isImage: boolean;
}

export type JoinChannelDTO = {
  channelIdentifier: string;
  label?: string;
};

export type MessageDTO = {
  channelId: number;
  phoneNumber: string;
  message: string;
  type: string;
};

export type ChannelMember = {
  isOwner?: boolean;
  channelId: number;
  identifier: string;
  phoneNumber?: string;
};

export type OwnerTransferReq = {
  userIdentifier: string;
  channelId: number;
  newOwnerPhoneNumber;
};

export type OwnerTransferResp = {
  ownerPhoneNumber: string;
  channelId: number;
};

export type UpdateLabelDto = {
  channelId: number;
  label: string;
};

export enum DarkchatEvents {
  ADD_CHANNEL = 'npwd:darkchatAddChannel',
  LEAVE_CHANNEL = 'npwd:darkchatLeaveChannel',
  DELETE_CHANNEL = 'npwd:darkchatDeleteChannel',
  DELETE_CHANNEL_SUCCESS = 'npwd:darkchatDeleteChannelSuccess',
  FETCH_MEMBERS = 'npwd:darkchatFetchMembers',
  TRANSFER_OWNERSHIP = 'npwd:darkchatTransferOwnership',
  TRANSFER_OWNERSHIP_SUCCESS = 'npwd:darkchatTransferOwnershipSuccess',
  FETCH_MESSAGES = 'npwd:darkchatFetchMessages',
  FETCH_CHANNELS = 'npwd:darkchatFetchChannels',
  BROADCAST_MESSAGE = 'npwd:darkchatBroadcastMessage',
  BROADCAST_LABEL_UPDATE = 'npwd:darkchatBroadcastLabelUpdate',
  SEND_MESSAGE = 'npwd:darkchatSendMessage',
  UPDATE_CHANNEL_LABEL = 'npwd:darkchatUpdateChannelLabel',
}
