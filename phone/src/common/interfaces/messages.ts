export interface Message {
  id: number;
  message: string;
  user_identifier: string;
  phone_number: string;
  display?: string;
  avatar?: string;
  isRead: boolean;
  isMine: boolean;
  updatedAt: string;
}

export interface MessageGroup {
  groupId: string;
  groupDisplay: string;
  updatedAt: string;
}
