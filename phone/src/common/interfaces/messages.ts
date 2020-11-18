export interface Message {
  id?: number;
  content: string;
  user_id: number;
  user_name?: string;
  conversation_id: number;
  isRead: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ConversationParticpant {
  id?: number;
  user_id: number;
  conversation_id: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Conversation {
  participants: ConversationParticpant[];
  createdAt?: string;
  updatedAt?: string;
}
