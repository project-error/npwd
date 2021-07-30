import { IAlertProps } from '../../../typings/alerts';
import { ActiveCall, CallEvents, CallRejectReasons } from '../../../typings/call';
import { animationService } from '../animations/animation.controller';

const exp = (global as any).exports;

export class CallService {
  private currentCall: number;

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

  isInCall() {
    return this.currentCall !== 0;
  }

  openCallModal(show: boolean) {
    CallService.sendCallAction<boolean>(CallEvents.SET_CALL_MODAL, show);
  }

  handleRejectCall() {
    // we don't want to reset our UI if we're in a call already.
    if (this.isInCall()) return;
    this.openCallModal(false);
    CallService.sendCallAction(CallEvents.SET_CALLER, null);
  }

  handleStartCall(transmitter: string, receiver: string, isTransmitter: boolean) {
    // If we're already in a call we want to automatically reject
    if (this.isInCall())
      return emitNet(CallEvents.REJECTED, transmitter, CallRejectReasons.BUSY_LINE);

    this.openCallModal(true);
    animationService.startPhoneCall();

    SendNUIMessage({
      app: 'CALL',
      method: CallEvents.SET_CALLER,
      data: {
        active: true,
        transmitter: transmitter,
        receiver: receiver,
        isTransmitter: isTransmitter,
        accepted: false,
      },
    });
  }

  handleCallAccepted(callData: ActiveCall) {
    this.currentCall = callData.channelId;
    exp['pma-voice'].setCallChannel(callData.channelId);
    CallService.sendCallAction<ActiveCall>(CallEvents.SET_CALLER, callData);
  }

  handleEndCall() {
    this.currentCall = 0;
    exp['pma-voice'].setCallChannel(0);
    this.openCallModal(false);

    CallService.sendCallAction<null>(CallEvents.SET_CALLER, null);
  }

  handleSendAlert(alert: IAlertProps) {
    SendNUIMessage({
      app: 'DIALER',
      method: CallEvents.SEND_ALERT,
      data: alert,
    });
  }
}
