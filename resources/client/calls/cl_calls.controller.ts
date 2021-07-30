import {
  ActiveCall,
  CallEvents,
  EndCallDTO,
  InitializeCallDTO,
  StartCallEventData,
  TransmitterNumDTO,
} from '../../../typings/call';
import { IAlertProps } from '../../../typings/alerts';
import { CallService } from './cl_calls.service';
import { animationService } from '../animations/animation.controller';
import { emitNetTyped, onNetTyped } from '../../server/utils/miscUtils';
import { RegisterNuiCB, RegisterNuiProxy } from '../cl_utils';
import { ClUtils } from '../client';
import { ServerPromiseResp } from '../../../typings/common';

const callService = new CallService();

// Will trigger whenever somebody initializes a call to any number
RegisterNuiCB<InitializeCallDTO>(CallEvents.INITIALIZE_CALL, async (data, cb) => {
  // If they are already in a call return without initializing a new one.
  if (callService.isInCall()) return;

  try {
    const serverRes = await ClUtils.emitNetPromise<ServerPromiseResp<ActiveCall>>(
      CallEvents.INITIALIZE_CALL,
      data,
    );

    // If something went wrong lets inform the client
    if (serverRes.status !== 'ok') {
      return cb(serverRes);
    }

    const { transmitter, isTransmitter, receiver } = serverRes.data;
    // Start the process of giving NUI feedback by opening NUI modal
    callService.handleStartCall(transmitter, receiver, isTransmitter);

    cb({ status: 'ok' });
  } catch (e) {
    console.error(e);
    cb({ status: 'error', errorMsg: 'CLIENT_TIMED_OUT' });
  }
});

onNetTyped<StartCallEventData>(CallEvents.START_CALL, (data) => {
  const { transmitter, isTransmitter, receiver } = data;
  callService.handleStartCall(transmitter, receiver, isTransmitter);
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

onNet(CallEvents.WAS_REJECTED, async () => {
  callService.handleRejectCall();
  animationService.endPhoneCall();
});

RegisterNuiCB<EndCallDTO>(CallEvents.END_CALL, async (data, cb) => {
  try {
    const serverRes: ServerPromiseResp<void> = await ClUtils.emitNetPromise(
      CallEvents.END_CALL,
      data,
    );
    if (serverRes.status === 'error') return console.error(serverRes.errorMsg);
    callService.handleEndCall();
    cb({});
  } catch (e) {
    console.error(e);
    cb({ status: 'error', errorMsg: 'CLIENT_TIMED_OUT' });
  }
  animationService.endPhoneCall();
});

onNet(CallEvents.WAS_ENDED, () => {
  callService.handleEndCall();
  animationService.endPhoneCall();
});

// Simple fetch so lets just proxy it
RegisterNuiProxy(CallEvents.FETCH_CALLS);

onNet(CallEvents.SEND_ALERT, (alert: IAlertProps) => {
  callService.handleSendAlert(alert);
});
