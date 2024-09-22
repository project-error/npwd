export interface Settings extends Record<string, unknown> {
  theme: 'light' | 'dark';
  scale: number;
}

export interface Device {
  id: number;
  sim_card_id: number;
  identifier: string;
  settings: Settings; // JSON
  created_at: Date;
  updated_at: Date;
}

export interface SimCard {
  id: number;
  is_active: boolean;
  phone_number: string;
  created_at: Date;
  updated_at: Date;
}

export interface SimCardWithDevice extends SimCard {
  deviceId: number;
  deviceIdentifier: string;
}

export interface DeviceWithSimCard extends Device {
  sim_card_id: number;
  sim_card_is_active: boolean;
  phone_number: string;
}

export interface Call extends Record<string, unknown> {
  id: number;
  caller_id: number;
  receiver_id: number;

  is_anonymous: boolean;

  created_at: Date;
  accepted_at?: Date;
  ended_by?: 'caller' | 'receiver';
  ended_at?: Date;
  declined_at?: Date;
  missed_at?: Date;
  acknowledged_at?: Date;
}

export interface CallWithPhoneNumbers extends Call {
  caller_phone_number: string;
  receiver_phone_number: string;
}

export interface Message extends Record<string, unknown> {
  id: number;
  sender_id: number;
  receiver_id: number;
  content: string;
  embed_type: 'image' | 'video' | 'audio' | null;
  embed_content: string | null;
  created_at: Date;
  updated_at: Date;
}

export type InsertMessage = Pick<
  Message,
  'receiver_id' | 'sender_id' | 'content' | 'embed_type' | 'embed_content'
>;

export interface MessageWithPhoneNumbers extends Message {
  sender_phone_number: string;
  receiver_phone_number: string;
}

export interface MessageWithPhoneNumbers extends Message {
  sender_phone_number: string;
  receiver_phone_number: string;
}

export interface Conversation {
  sender: string;
  receiver: string;
}

export interface Contact {
  id: number;
  name: string;
  phone_number: string;
  sim_card_id: number;
  created_at: Date;
}

export interface Notification {
  id: string;
  path: string;
  type: 'call' | 'generic';
  title: string;
  timeout: number;
  description: string;
  created_at: string;

  appId?: string;
  overline?: string;
  dismissable?: boolean;
}

export type InsertNotification = Omit<Notification, 'id' | 'created_at' | 'timeout' | 'type'> & {
  type?: Notification['type'];
  timeout?: Notification['timeout'];
  created_at?: Notification['created_at'];
  dismissable?: Notification['dismissable'];
};
