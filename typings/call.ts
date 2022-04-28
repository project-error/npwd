export interface ActiveCall {
  is_accepted: boolean;
  isTransmitter: boolean;
  transmitter: string;
  receiver: string;
  channelId?: number;
  isUnavailable?: boolean;
  start?: string;
  identifier?: string;
}

export interface InitializeCallDTO {
  receiverNumber: string;
}

export interface StartCallEventData {
  transmitter: string;
  receiver: string;
  isTransmitter: boolean;
  isUnavailable?: boolean;
}

export interface EndCallDTO {
  transmitterNumber: string;
  isTransmitter: boolean;
  isUnavailable: boolean;
}

export interface TransmitterNumDTO {
  transmitterNumber: string;
}

export interface CallWasAcceptedEvent {
  channelId: number;
  currentCall: CallHistoryItem;
  isTransmitter: boolean;
}

export interface ActiveCallRaw {
  identifier: string;
  transmitter: string;
  transmitterSource: number;
  receiver: string;
  receiverSource: number;
  start: string;
  is_accepted: boolean;
}

export interface CallHistoryItem {
  id?: number | string;
  identifier?: string;
  transmitter: string;
  transmitterSource?: number;
  receiver: string;
  receiverSource?: number;
  start: string;
  end?: number;
  is_accepted: boolean;
}

export enum CallRejectReasons {
  DECLINED,
  BUSY_LINE,
}

export enum CallEvents {
  INITIALIZE_CALL = 'npwd:beginCall',
  START_CALL = 'npwd:startCall',
  ACCEPT_CALL = 'npwd:acceptCall',
  END_CALL = 'npwd:endCall',
  WAS_ENDED = 'npwd:callEnded',
  WAS_ACCEPTED = 'npwd:callAccepted',
  REJECTED = 'npwd:rejectCall',
  WAS_REJECTED = 'npwd:callRejected',
  FETCH_CALLS = 'npwd:fetchCalls',
  SET_CALL_INFO = 'npwd:setCaller',
  SET_CALL_MODAL = 'npwd:callModal',
  SEND_ALERT = 'npwd:callSetAlert',
  SAVE_CALL = 'npwd:saveCall',
}

interface IncomingCallerCtx {
  source: number;
  number: string;
  name: string;
}

export interface OnCallExportCtx {
  incomingCaller: IncomingCallerCtx;
  exit: () => void;
  next: () => void;
  reply: (msg: string) => void;
  forward: (tgt: string) => void;
}
