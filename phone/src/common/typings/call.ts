export interface CallProps {
  accepted: boolean;
  isTransmitter: boolean;
  transmitter: string;
  receiver: string;
}

export interface ICall {
  id?: number;
  identifier: string;
  transmitter: string;
  transmitterSource?: number;
  receiver: string;
  receiverSource?: number;
  start: number;
  end?: number;
  accepted: boolean;
}

export interface ICallDuration {
  ms: number;
  s: number;
  m: number;
  h: number;
}
