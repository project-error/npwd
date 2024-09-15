export interface Device {
  id: number;
  sim_card_id: number;
  identifier: string;
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

export interface Message {
  id: number;
  sender_id: number;
  receiver_id: number;
  content: string;
  created_at: Date;
  updated_at: Date;
}

export interface MessageWithPhoneNumbers extends Message {
  sender_phone_number: string;
  receiver_phone_number: string;
}

export interface Conversation {
  sender: string;
  receiver: string;
}
