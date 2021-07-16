import { IAlertProps } from '../../../typings/alerts';
import { CallEvents, CallHistoryItem, CallRejectReasons } from '../../../typings/call';

const exp = (global as any).exports;

export class CallService {
  private currentCall: number;

  constructor() {
    this.currentCall = 0;
  }

  isInCall() {
    return this.currentCall !== 0;
  }

  openCallModal(show: boolean) {
    SendNUIMessage({
      app: 'CALL',
      method: CallEvents.SET_CALL_MODAL,
      data: show,
    });
  }

  handleRejectCall() {
    // we don't want to reset our UI if we're in a call already.
    if (this.isInCall()) return;
    this.openCallModal(false);
    SendNUIMessage({
      app: 'CALL',
      method: CallEvents.SET_CALLER,
      data: {
        transmitter: null,
        receiver: null,
        isTransmitter: null,
        accepted: false,
        active: false,
      },
    });
  }

  handleStartCall(transmitter: string, receiver: string, isTransmitter: boolean) {
    // If we're already in a call we want to automatically reject
    if (this.isInCall())
      return emitNet(CallEvents.REJECTED, transmitter, CallRejectReasons.BUSY_LINE);
    this.openCallModal(true);

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

  handleCallAccepted(channelId: number, currentCall: CallHistoryItem, isTransmitter: boolean) {
    this.currentCall = channelId;
    exp['pma-voice'].setCallChannel(channelId);
    // phoneCallStartAnim(); // Trigger call animation only if the call was accepted.
    SendNUIMessage({
      app: 'CALL',
      method: CallEvents.SET_CALLER,
      data: {
        active: true,
        transmitter: currentCall.transmitter,
        receiver: currentCall.receiver,
        isTransmitter: isTransmitter,
        accepted: true,
      },
    });
  }

  handleEndCall() {
    this.currentCall = 0;
    exp['pma-voice'].setCallChannel(0);
    this.openCallModal(false);

    SendNUIMessage({
      app: 'CALL',
      method: CallEvents.SET_CALLER,
      data: {
        transmitter: null,
        receiver: null,
        isTransmitter: null,
        accepted: false,
        active: false,
      },
    });
  }

  handleSendAlert(alert: IAlertProps) {
    SendNUIMessage({
      app: 'DIALER',
      method: CallEvents.SEND_ALERT,
      data: alert,
    });
  }

  handleFetchCalls(calls: CallHistoryItem[]) {
    SendNUIMessage({
      app: 'DIALER',
      method: CallEvents.SET_CALL_HISTORY,
      data: calls,
    });
  }
}
