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
