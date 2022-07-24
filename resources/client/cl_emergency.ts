import {
  AnimationModel,
  AudioEventArguments,
  AudioTypes,
  DispatchModel,
  EmergencyEvents,
  EmergencyServices,
} from '../../typings/emergency';
import { RegisterNuiCB } from './cl_utils';
import { Sound } from './sounds/client-sound.class';
import { Ringtone } from './sounds/client-ringtone.class';
import { animationService } from './animations/animation.controller';

let ringtone: Ringtone;
const callSoundName = 'Remote_Ring';
const hangUpSoundName = 'Hang_Up';
const soundSet = 'Phone_SoundSet_Default';
const hangUpSoundSet = 'Phone_SoundSet_Michael';
const callSound: Sound = new Sound(callSoundName, soundSet);
const hangupSound = new Sound(hangUpSoundName, hangUpSoundSet);

RegisterNuiCB<AnimationModel>(EmergencyEvents.ANIMATION, (data, cb) => {
  console.log('iscalling', data);
  if (data.isCalling) {
    animationService.startPhoneCall();
  } else {
    animationService.endPhoneCall();
  }
  cb({});
});

// RegisterNuiCB<DispatchModel>(EmergencyEvents.DISPATCH, (dispatch, cb) => {
//   console.log('dispatching', dispatch, GetEntityCoords(GetPlayerPed(-1), true));
//   emitNet('core_dispatch:addMessage',dispatch.message,GetEntityCoords(GetPlayerPed(-1), true),dispatch.job,5000,11,5 );
//   cb({});
// });

RegisterNuiCB<DispatchModel>(EmergencyEvents.DISPATCH, (dispatch, cb) => {
  //TODO: implement
  console.log('dispatching', dispatch, GetEntityCoords(GetPlayerPed(-1), true));
  emitNet(
    'core_dispatch:addMessage',
    dispatch.message,
    GetEntityCoords(GetPlayerPed(-1), true),
    dispatch.job,
    5000,
    11,
    5,
  );
  cb({});
});

RegisterNuiCB<AudioEventArguments>(EmergencyEvents.PLAY_AUDIO, (args, cb) => {
  console.log('Data in cl_emergency', args.type);
  switch (args.type) {
    case AudioTypes.START_CALL:
      callSound.play();
      setTimeout(() => {
        console.log('stopping sound');
        callSound.stop();

        cb({});
      }, 3000);
      break;
    case AudioTypes.END_CALL:
      hangupSound.play();
      setTimeout(() => {
        console.log('stopping sound');
        hangupSound.stop();

        cb({});
      }, 1000);
  }
});
