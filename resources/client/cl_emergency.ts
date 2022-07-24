import { AudioEventArguments, AudioTypes, EmergencyEvents } from '../../typings/emergency';
import { RegisterNuiCB } from './cl_utils';
import { Sound } from './sounds/client-sound.class';
import { Ringtone } from './sounds/client-ringtone.class';

let ringtone: Ringtone;
const callSoundName = 'Remote_Ring';
const hangUpSoundName = 'Hang_Up';
const soundSet = 'Phone_SoundSet_Default';
const hangUpSoundSet = 'Phone_SoundSet_Michael';
const callSound: Sound = new Sound(callSoundName, soundSet);
const hangupSound = new Sound(hangUpSoundName, hangUpSoundSet);

RegisterNuiCB(EmergencyEvents.DISPATCH, (DispatchModel: DispatchModel, cb) => {
  //TODO: implement
  console.log('dispatch');
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
