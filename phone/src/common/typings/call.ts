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
  transmitterIdentifier: string;
  receiver: string;
  receiverSource: number;
  receiverIdentifier: string;
}

export interface ICallUI {
  tranmitter: string;
  receiver: string;
  type: string;
}