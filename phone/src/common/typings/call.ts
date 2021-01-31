export interface CallProps {
  accepted: boolean;
  isTransmitter: boolean;
  transmitter: string;
  receiver: string;
}

export interface ICall {
  id?: number;
  transmitter: string;
  transmitterSource?: number;
  receiver: string;
  receiverSource?: number;
  timestamp: string;
}