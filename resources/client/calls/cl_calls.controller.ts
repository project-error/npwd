import {
  CallEvents,
  CallWasAcceptedEvent,
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
import { NuiCallbackFunc } from '@project-error/pe-utils';
import { ClUtils } from '../client';
import { ServerPromiseResp } from '../../../typings/common';

const callService = new CallService();

RegisterNuiCB<InitializeCallDTO>(CallEvents.INITIALIZE_CALL, async (data, cb) => {
  try {
    const serverRes = await ClUtils.emitNetPromise<ServerPromiseResp<StartCallEventData>>(
      CallEvents.INITIALIZE_CALL,
      data,
    );
    if (serverRes.status !== 'ok') {
      cb(serverRes);
    }

    const { transmitter, isTransmitter, receiver } = serverRes.data;

    callService.handleStartCall(transmitter, receiver, isTransmitter);

    cb({});
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

onNetTyped<CallWasAcceptedEvent>(
  CallEvents.WAS_ACCEPTED,
  ({ channelId, currentCall, isTransmitter }) => {
    callService.handleCallAccepted(channelId, currentCall, isTransmitter);
  },
);

// Rejected call
RegisterNuiCB<TransmitterNumDTO>(CallEvents.REJECTED, (data, cb: NuiCallbackFunc) => {
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
