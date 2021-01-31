export interface CallProps {
  accepted: boolean;
  isTransmitter: boolean;
  transmitter: string;
  receiver: string;
  phone_number: string;
  timestamp: string;
}

export interface ICall {
  transmitter: string;
  transmitterSource: number;
  receiver: string;
  receiverSource: number;
  timestamp: string;
}

export interface ICallUI {
  transmitter: string;
  receiver: string;
  timestamp: string;
}
