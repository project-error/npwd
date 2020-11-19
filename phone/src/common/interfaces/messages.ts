export interface Message {
  id?: number;
  content: string;
  user_identifier: string;
  channel_id: number;
  isRead: boolean;
  isMine: boolean;
  avatar?: string;
  phone_number?: string;
  display?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface MessageGroup {
  channelId: string;
  messages: Message[];
  channelDisplay: string;
  createdAt?: string;
  updatedAt?: string;
}
