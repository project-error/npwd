import { checkHasPhone } from '../cl_main';
import { IAlertProps } from '@typings/alerts';
import { ActiveCall, CallEvents, CallRejectReasons } from '@typings/call';
import { Sound } from '../sounds/client-sound.class';
import { Ringtone } from '../sounds/client-ringtone.class';
import { KvpItems } from '@typings/settings';
import KvpService from '../settings/client-kvp.service';

const exp = global.exports;

export class CallService {
  private currentCall: number;
  private currentPendingCall: string | null;
  private callSound: Sound;
  private ringtone: Ringtone;
  private callSoundName = 'Remote_Ring';
  private hangUpSoundName = 'Hang_Up';
  private soundSet = 'Phone_SoundSet_Default';

  // Using the Micheal set for hang up, since the default is awful.
  private hangUpSoundSet = 'Phone_SoundSet_Michael';

  constructor() {
    this.currentCall = 0;
  }

  static sendCallAction<T>(method: CallEvents, data: T): void {
    SendNUIMessage({
      app: 'CALL',
      method,
      data,
    });
  }

  static sendDialerAction<T>(method: CallEvents, data: T): void {
    SendNUIMessage({
      app: 'DIALER',
      method,
      data,
    });
  }

  isInCall() {
    return this.currentCall !== 0;
  }

  isCurrentCall(tgtCall: number) {
    return this.currentCall === tgtCall;
  }

  isInPendingCall() {
    return !!this.currentPendingCall;
  }

  isCurrentPendingCall(target: string) {
    return target === this.currentPendingCall;
  }

  openCallModal(show: boolean) {
    CallService.sendCallAction<boolean>(CallEvents.SET_CALL_MODAL, show);
  }

  handleRejectCall(receiver: string) {
    // we don't want to reset our UI if we're in a call already or if we're currently starting a call that hasn't been canceled
    if (this.isInCall() || !this.isCurrentPendingCall(receiver)) return;
    if (this.callSound) this.callSound.stop();
    if (Ringtone.isPlaying()) this.ringtone.stop();
    this.currentPendingCall = null;
    this.openCallModal(false);
    CallService.sendCallAction(CallEvents.SET_CALL_INFO, null);

    const hangUpSound = new Sound(this.hangUpSoundName, this.hangUpSoundSet);
    hangUpSound.play();
  }

  async handleStartCall(
    transmitter: string,
    receiver: string,
    isTransmitter: boolean,
    isUnavailable: boolean,
  ) {
    // If we're already in a call we want to automatically reject
    if (this.isInCall() || !(await checkHasPhone()) || this.currentPendingCall)
      return emitNet(
        CallEvents.REJECTED,
        { transmitterNumber: transmitter },
        CallRejectReasons.BUSY_LINE,
      );

    this.currentPendingCall = receiver;

    this.openCallModal(true);

    if (isTransmitter) {
      this.callSound = new Sound(this.callSoundName, this.soundSet);
      this.callSound.play();
    }

    if (!isTransmitter) {
      const ringtone = KvpService.getKvpString(KvpItems.NPWD_RINGTONE);
      this.ringtone = new Ringtone(ringtone);
      this.ringtone.play();
    }

    CallService.sendCallAction(CallEvents.SET_CALL_INFO, {
      active: true,
      transmitter: transmitter,
      receiver: receiver,
      isTransmitter: isTransmitter,
      accepted: false,
      isUnavailable: isUnavailable,
    });
  }

  handleCallAccepted(callData: ActiveCall) {
    this.currentCall = callData.channelId;
    if (this.callSound) this.callSound.stop();
    if (Ringtone.isPlaying()) this.ringtone.stop();
    exp['pma-voice'].setCallChannel(callData.channelId);
    CallService.sendCallAction<ActiveCall>(CallEvents.SET_CALL_INFO, callData);
  }

  handleEndCall() {
    if (this.callSound) this.callSound.stop();
    this.currentCall = 0;
    exp['pma-voice'].setCallChannel(0);
    this.currentPendingCall = null;

    this.openCallModal(false);
    CallService.sendCallAction<null>(CallEvents.SET_CALL_INFO, null);

    const hangUpSound = new Sound(this.hangUpSoundName, this.hangUpSoundSet);
    hangUpSound.play();
  }

  handleSendAlert(alert: IAlertProps) {
    SendNUIMessage({
      app: 'DIALER',
      method: CallEvents.SEND_ALERT,
      data: alert,
    });
  }
}
