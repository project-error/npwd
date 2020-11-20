export interface Message {
  id?: number;
  message: string;
  user_identifier: string;
  group_id: number;
  isRead: boolean;
  isMine: boolean;
  avatar?: string;
  phone_number?: string;
  display?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface MessageGroup {
  groupId: string;
  messages: Message[];
  groupDisplay: string;
  createdAt?: string;
  updatedAt?: string;
}
