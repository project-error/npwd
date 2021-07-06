import { CallEvents } from '../../../typings/call';
import { CallHistoryItem } from '../../../typings/call';
import { IAlertProps } from '../../../typings/alerts';
import { CallService } from './cl_calls.service';
import { animationService } from '../animations/animation.controller';

const callService = new CallService();

RegisterNuiCallbackType(CallEvents.INITIALIZE_CALL); // Fires when the call is started.
on(`__cfx_nui:${CallEvents.INITIALIZE_CALL}`, (data: any, cb: Function) => {
  emitNet(CallEvents.INITIALIZE_CALL, data.number);
  cb();
});

onNet(CallEvents.START_CALL, (transmitter: string, receiver: string, isTransmitter: boolean) => {
  if(isTransmitter){
    animationService.startPhoneCall();
  }
	callService.handleStartCall(transmitter, receiver, isTransmitter)
});

RegisterNuiCallbackType(CallEvents.ACCEPT_CALL); // Fires when the TARGET accepts.
on(`__cfx_nui:${CallEvents.ACCEPT_CALL}`, (data: any, cb: Function) => {
  animationService.startPhoneCall();
  emitNet(CallEvents.ACCEPT_CALL, data.transmitterNumber);
  cb();
});

onNet(CallEvents.WAS_ACCEPTED, (channelId: number, currentCall: CallHistoryItem, isTransmitter: boolean) => {
	callService.handleCallAccepted(channelId, currentCall, isTransmitter)
});

RegisterNuiCallbackType(CallEvents.REJECTED); // Fires when cancelling and rejecting a call.
on(`__cfx_nui:${CallEvents.REJECTED}`, (data: any, cb: Function) => {
  console.log('rejected?')
  emitNet(CallEvents.REJECTED, data.phoneNumber);
  cb();
});

onNet(CallEvents.WAS_REJECTED, async() => {
	callService.handleRejectCall();
	animationService.endPhoneCall();
});

RegisterNuiCallbackType(CallEvents.END_CALL); // Fires when ending an ACTIVE call
on(`__cfx_nui:${CallEvents.END_CALL}`, (data: any, cb: Function) => {
  const end = Date.now();
  animationService.endPhoneCall();
  emitNet(CallEvents.END_CALL, data.transmitterNumber, end);
  cb();
});

onNet(CallEvents.WAS_ENDED, () => {
	callService.handleEndCall();
  animationService.endPhoneCall();
});


onNet(CallEvents.FETCH_CALLS, (calls: CallHistoryItem[]) => {
	callService.handleFetchCalls(calls);
});

onNet(CallEvents.SEND_ALERT, (alert: IAlertProps) => {
  callService.handleSendAlert(alert);
});
