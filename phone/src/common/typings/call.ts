export interface CallProps {
  active: boolean;
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

export enum CallNetEvents {
  INITIALIZE_CALL = 'phone:beginCall',
  START_CALL = 'phone:startCall',
  ACCEPT_CALL = 'phone:acceptCall',
  END_CALL = 'phone:endCall',
  WAS_ENDED = 'phone:callEnded',
  WAS_ACCEPTED = 'phone:callAccepted',
  REJECTED = 'phone:rejectCall',
  WAS_REJECTED = 'phone:callRejected',
  FETCH_CALLS = 'phone:fetchCalls',
  SEND_HISTORY = 'phone:sendCallHistory',
  SEND_HANGUP_ANIM = 'phone:sendHangupAnim',
}
