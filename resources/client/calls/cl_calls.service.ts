import { checkHasPhone } from '../cl_main';
import { IAlertProps } from '../../../typings/alerts';
import { ActiveCall, CallEvents, CallRejectReasons } from '../../../typings/call';

const exp = global.exports;

export class CallService {
  private currentCall: number;
  private currentPendingCall: string | null;

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
    this.openCallModal(false);
    this.currentPendingCall = null;
    CallService.sendCallAction(CallEvents.SET_CALL_INFO, null);
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
    exp['pma-voice'].setCallChannel(callData.channelId);
    CallService.sendCallAction<ActiveCall>(CallEvents.SET_CALL_INFO, callData);
  }

  handleEndCall() {
    this.currentCall = 0;
    exp['pma-voice'].setCallChannel(0);
    this.openCallModal(false);
    this.currentPendingCall = null;

    CallService.sendCallAction<null>(CallEvents.SET_CALL_INFO, null);
  }

  handleSendAlert(alert: IAlertProps) {
    SendNUIMessage({
      app: 'DIALER',
      method: CallEvents.SEND_ALERT,
      data: alert,
    });
  }
}
