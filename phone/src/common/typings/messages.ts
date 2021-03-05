export interface Message {
  id: number;
  message: string;
  user_identifier: string;
  phone_number: string;
  groupId?: string;
  display?: string;
  avatar?: string;
  isRead: boolean;
  isMine: boolean;
  updatedAt: string;
}

export interface MessageGroup {
  groupId: string;
  groupDisplay: string;
  isGroupChat: boolean;
  avatar?: string;
  label?: string;
  updatedAt: string;
  unreadCount: number;
  phoneNumbers: string[];
  participants: string[];
}

export interface CreateMessageGroupResult {
  error?: boolean;
  phoneNumber?: string;
  duplicate?: boolean;
  groupId?: string;
  mine?: boolean;
  identifiers?: string[];
}

export interface CreateMessageBroadcast {
  message: string;
  groupName: string;
  groupId: string;
}

export interface SetMessageRead {
  groupId: string;
}

export enum MessagesNetEvents {
  FETCH_MESSAGE_GROUPS = 'phone:fetchMessageGroups',
  FETCH_MESSAGE_GROUPS_SUCCESS = 'phone:fetchMessageGroupsSuccess',
  FETCH_MESSAGE_GROUPS_FAILED = 'phone:fetchMessageGroupsFailed',
  CREATE_MESSAGE_GROUP = 'phone:createMessageGroup',
  CREATE_MESSAGE_GROUP_SUCCESS = 'phone:createMessageGroupSuccess',
  CREATE_MESSAGE_GROUP_FAILED = 'phone:createMessageGroupFailed',
  SEND_MESSAGE = 'phone:sendMessage',
  SEND_MESSAGE_SUCCESS = 'phone:sendMessageSuccess',
  SEND_MESSAGE_FAILED = 'phone:sendMessageFailed',
  FETCH_MESSAGES = 'phone:fetchMessages',
  FETCH_MESSAGES_SUCCESS = 'phone:fetchMessagesSuccess',
  FETCH_MESSAGES_FAILED = 'phone:fetchMessagesFailed',
  ACTION_RESULT = 'phone:setMessagesAlert',
  CREATE_MESSAGE_BROADCAST = 'createMessagesBroadcast',
  SET_MESSAGE_READ = 'phone:setReadMessages',
}
