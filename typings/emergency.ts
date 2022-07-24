export enum EmergencyEvents {
  PLAY_AUDIO = 'npwd:playDispatchAudioStart',
  DISPATCH = 'npwd:dispatchEmergencyService',
  ANIMATION = 'npwd:callAnimationEmergency',
}
export enum EmergencyServices {
  POLICE = 'police',
  AMBULANCE = 'ambulance',
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

export interface DispatchModel {
  message: string;
  job: EmergencyServices;
}

export interface AnimationModel {
  isCalling: bool;
}

// addEventHandler("core_dispatch:addCall", function(code, title, info, location, job, cooldown, sprite, color)
//    TriggerServerEvent("core_dispatch:addCall","10-90","Bank Robbery in Progress",{{icon = "fa-university", info = ''}},{LD.FleecaBanks[name].doors.startloc.x, LD.FleecaBanks[name].doors.startloc.y, LD.FleecaBanks[name].doors.startloc.z},"police",5000,375,21)
