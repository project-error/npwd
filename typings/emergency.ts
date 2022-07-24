export enum EmergencyEvents {
  PLAY_AUDIO = 'npwd:playDispatchAudioStart',
  DISPATCH = 'npwd:dispatchEmergencyService',
}
export enum EmergencyServices {
  POLICE,
  AMBULANCE,
}

export enum AudioTypes {
  START_CALL = 'startCall',
  DISPATCH_POLICE = 'dispatchPolice',
  DISPATCH_AMBULANCE = 'Dispatch_ambulance',
  END_CALL = 'endCall',
}

export interface AudioEventArguments {
  type: AudioTypes;
}

export interface DispatchModel {}
