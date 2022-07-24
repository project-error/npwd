import { EmergencyEvents } from '../../typings/emergency';
import { RegisterNuiCB, RegisterNuiProxy } from './cl_utils';
import { sendMessage } from '../utils/messages';

// let callSound: Sound;
// let ringtone: Ringtone;
// let callSoundName = 'Remote_Ring';
// let hangUpSoundName = 'Hang_Up';
// let soundSet = 'Phone_SoundSet_Default';

RegisterNuiCB(EmergencyEvents.DISPATCH, (transaction, cb) => {
  // console.log('transfer final was hit.');
  // console.log(transaction);
  // emitNet(
  //   'okokBanking:TransferMoney',
  //   transaction.value,
  //   transaction.sender_name,
  //   transaction.receiver_identifier,
  //   { bank: transaction.bank },
  //   transaction.receiver_name,
  // );
  //TODO: implement
  cb({});

  const hangUpSound = new Sound(this.hangUpSoundName, this.hangUpSoundSet);
  hangUpSound.play();
});
