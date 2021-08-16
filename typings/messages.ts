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

export interface MessageConversation {
  conversation_id: number;
  avatar: string;
  display: string;
  phone_number: string;
  latest_message: string;
}

/**
 * Used for the raw npwd_messages_groups row responses
 */
export interface UnformattedMessageConversation {
  conversation_id: string;
  user_identifier: string;
  participant_identifier: string;
  phone_number: string;
  avatar?: string;
  display?: string;
  updatedAt?: string;
  unread: number;
}

/**
 * Used to help consolidate raw npwd_messages_groups rows into
 * a mapping of a single message group
 */
export interface MessageGroupMapping {
  [groupId: string]: {
    user_identifier: string;
    // Participant displays
    participants: string[];
    phoneNumbers: string[];
    label?: string;
    avatar?: string;
    updatedAt: string;
    unreadCount: number;
  };
}

export interface CreateMessageGroupResult {
  error?: boolean;
  phoneNumber?: string;
  duplicate?: boolean;
  groupId?: string;
  mine?: boolean;
  identifiers?: string[];
  allNumbersFailed?: boolean;
  failedNumbers: string[];
}

export interface CreateMessageBroadcast {
  message: string;
  groupName: string;
  groupId: string;
}

export interface SetMessageRead {
  groupId: string;
}

export enum MessageEvents {
  FETCH_MESSAGE_CONVERSATIONS = 'npwd:fetchMessageGroups',
  FETCH_MESSAGE_GROUPS_SUCCESS = 'npwd:fetchMessageGroupsSuccess',
  FETCH_MESSAGE_GROUPS_FAILED = 'npwd:fetchMessageGroupsFailed',
  CREATE_MESSAGE_GROUP = 'npwd:createMessageGroup',
  CREATE_MESSAGE_GROUP_SUCCESS = 'npwd:createMessageGroupSuccess',
  CREATE_MESSAGE_GROUP_FAILED = 'npwd:createMessageGroupFailed',
  SEND_MESSAGE = 'npwd:sendMessage',
  SEND_MESSAGE_SUCCESS = 'npwd:sendMessageSuccess',
  SEND_MESSAGE_FAILED = 'npwd:sendMessageFailed',
  FETCH_MESSAGES = 'npwd:fetchMessages',
  FETCH_MESSAGES_SUCCESS = 'npwd:fetchMessagesSuccess',
  FETCH_MESSAGES_FAILED = 'npwd:fetchMessagesFailed',
  ACTION_RESULT = 'npwd:setMessagesAlert',
  CREATE_MESSAGE_BROADCAST = 'createMessagesBroadcast',
  SET_MESSAGE_READ = 'npwd:setReadMessages',
}
