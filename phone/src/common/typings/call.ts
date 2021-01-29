export interface CallProps {
  accepted: boolean;
  isTransmitter: boolean;
  transmitter: string;
  receiver: string;
  phone_number: string;
}

export interface ICall {
  transmitter: string;
  transmitterSource: number;
  receiver: string;
  receiverSource: number;
}

export interface ICallUI {
  tranmitter: string;
  receiver: string;
  type: string;
}
