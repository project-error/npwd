import {
  ActiveCall,
  ActiveCallRaw,
  CallEvents,
  EndCallDTO,
  InitializeCallDTO,
  StartCallEventData,
  TransmitterNumDTO,
} from '@typings/call';
import { IAlertProps } from '@typings/alerts';
import { callService, CallService } from './cl_calls.service';
import { animationService } from '../animations/animation.controller';
import { emitNetTyped, onNetTyped } from '../../server/utils/miscUtils';
import { RegisterNuiCB, RegisterNuiProxy } from '../cl_utils';
import { ClUtils } from '../client';
import { ServerPromiseResp } from '@typings/common';
import { NuiCallbackFunc } from '@project-error/pe-utils';

export const initializeCallHandler = async (data: InitializeCallDTO, cb?: NuiCallbackFunc) => {
  if (callService.isInCall()) return;

  try {
    const serverRes = await ClUtils.emitNetPromise<ServerPromiseResp<ActiveCall>>(
      CallEvents.INITIALIZE_CALL,
      data,
    );

    animationService.startPhoneCall();
    // If something went wrong lets inform the client
    if (serverRes.status !== 'ok') {
      return cb?.(serverRes);
    }
    const { transmitter, label, isTransmitter, receiver, isUnavailable } = serverRes.data;
    // Start the process of giving NUI feedback by opening NUI modal
    callService.handleStartCall(transmitter, receiver, isTransmitter, isUnavailable, label);
    cb?.(serverRes);
  } catch (e) {
    console.error(e);
    cb?.({ status: 'error', errorMsg: 'CLIENT_TIMED_OUT' });
  }
};

// Will trigger whenever somebody initializes a call to any number
RegisterNuiCB<InitializeCallDTO>(CallEvents.INITIALIZE_CALL, initializeCallHandler);

onNetTyped<StartCallEventData>(CallEvents.START_CALL, async (data) => {
  const { transmitter, label, isTransmitter, receiver, isUnavailable } = data;
  callService.handleStartCall(transmitter, receiver, isTransmitter, isUnavailable, label);
});

RegisterNuiCB<TransmitterNumDTO>(CallEvents.ACCEPT_CALL, (data, cb) => {
  animationService.startPhoneCall();
  emitNetTyped<TransmitterNumDTO>(CallEvents.ACCEPT_CALL, data);
  cb({});
});

onNetTyped<ActiveCall>(CallEvents.WAS_ACCEPTED, (callData) => {
  callService.handleCallAccepted(callData);
});

// Rejected call
RegisterNuiCB<TransmitterNumDTO>(CallEvents.REJECTED, (data, cb) => {
  emitNetTyped<TransmitterNumDTO>(CallEvents.REJECTED, data);
  cb({});
});

onNet(CallEvents.WAS_REJECTED, async (currentCall: ActiveCallRaw) => {
  callService.handleRejectCall(currentCall.receiver);
  animationService.endPhoneCall();
  CallService.sendDialerAction(CallEvents.WAS_REJECTED, currentCall);
});

RegisterNuiCB<EndCallDTO>(CallEvents.END_CALL, async (data, cb) => {
  try {
    const serverRes: ServerPromiseResp<void> = await ClUtils.emitNetPromise(
      CallEvents.END_CALL,
      data,
    );
    if (serverRes.status === 'error') return console.error(serverRes.errorMsg);
    cb({});
  } catch (e) {
    console.error(e);
    cb({ status: 'error', errorMsg: 'CLIENT_TIMED_OUT' });
  }
  animationService.endPhoneCall();
});

onNet(CallEvents.WAS_ENDED, (callStarter: number, currentCall?: ActiveCallRaw) => {
  if (callService.isInCall() && !callService.isCurrentCall(callStarter)) return;
  callService.handleEndCall();
  animationService.endPhoneCall();
  if (currentCall) {
    CallService.sendDialerAction(CallEvents.WAS_REJECTED, currentCall);
  }
});

// Simple fetch so lets just proxy it
RegisterNuiProxy(CallEvents.FETCH_CALLS);

onNet(CallEvents.SEND_ALERT, (alert: IAlertProps) => {
  callService.handleSendAlert(alert);
});

RegisterNuiCB(CallEvents.TOGGLE_MUTE_CALL, (data: { call: ActiveCall; state: boolean }, cb) => {
  const { state, call } = data;
  callService.handleMute(state, call);

  cb({});
});
