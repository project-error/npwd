import { CallEvents } from '../../typings/call';
import { ICall } from '../../typings/call';
import { phoneCallStartAnim, phoneCallEndAnim } from './functions';

const exp = (global as any).exports;

RegisterNuiCallbackType(CallEvents.INITIALIZE_CALL); // Fires when the call is started.
on(`__cfx_nui:${CallEvents.INITIALIZE_CALL}`, (data: any, cb: Function) => {
  emitNet(CallEvents.INITIALIZE_CALL, data.number);
  cb();
});

onNet(CallEvents.START_CALL, (transmitter: string, receiver: string, isTransmitter: boolean) => {
  openCallModal(true);

  SendNuiMessage(
    JSON.stringify({
      app: 'CALL',
      method: CallEvents.SET_CALLER,
      data: {
        active: true,
        transmitter: transmitter,
        receiver: receiver,
        isTransmitter: isTransmitter,
        accepted: false,
      },
    }),
  );
});

RegisterNuiCallbackType(CallEvents.ACCEPT_CALL); // Fires when the TARGET accepts.
on(`__cfx_nui:${CallEvents.ACCEPT_CALL}`, (data: any, cb: Function) => {
  emitNet(CallEvents.ACCEPT_CALL, data.transmitterNumber);
  cb();
});

onNet(CallEvents.WAS_ACCEPTED, (channelId: number, currentCall: ICall, isTransmitter: boolean) => {
  exp['mumble-voip'].SetCallChannel(channelId);
  phoneCallStartAnim(); // Trigger call animation only if the call was accepted.
  SendNuiMessage(
    JSON.stringify({
      app: 'CALL',
      method: CallEvents.SET_CALLER,
      data: {
        active: true,
        transmitter: currentCall.transmitter,
        receiver: currentCall.receiver,
        isTransmitter: isTransmitter,
        accepted: true,
      },
    }),
  );
});

RegisterNuiCallbackType(CallEvents.REJECTED); // Fires when cancelling and rejecting a call.
on(`__cfx_nui:${CallEvents.REJECTED}`, (data: any, cb: Function) => {
  emitNet(CallEvents.REJECTED, data.phoneNumber);
  cb();
});

onNet(CallEvents.WAS_REJECTED, () => {
  openCallModal(false);
  SendNuiMessage(
    JSON.stringify({
      app: 'CALL',
      method: CallEvents.SET_CALLER,
      data: {
        transmitter: null,
        receiver: null,
        isTransmitter: null,
        accepted: false,
        active: false,
      },
    }),
  );
});

onNet(CallEvents.SEND_HANGUP_ANIM, () => {
  phoneCallEndAnim();
});

RegisterNuiCallbackType(CallEvents.END_CALL); // Fires when ending an ACTIVE call
on(`__cfx_nui:${CallEvents.END_CALL}`, (data: any, cb: Function) => {
  const end = Date.now();
  emitNet(CallEvents.END_CALL, data.transmitterNumber, end);
  cb();
});

onNet(CallEvents.WAS_ENDED, () => {
  exp['mumble-voip'].SetCallChannel(0);
  openCallModal(false);

  SendNuiMessage(
    JSON.stringify({
      app: 'CALL',
      method: CallEvents.SET_CALLER,
      data: {
        transmitter: null,
        receiver: null,
        isTransmitter: null,
        accepted: false,
        active: false,
      },
    }),
  );
});

function openCallModal(show: boolean) {
  SendNuiMessage(
    JSON.stringify({
      app: 'CALL',
      method: CallEvents.SET_CALL_MODAL,
      data: show,
    }),
  );
}

onNet(CallEvents.SEND_HISTORY, (calls: ICall) => {
  SendNuiMessage(
    JSON.stringify({
      app: 'DIALER',
      method: CallEvents.SET_CALL_HISTORY,
      data: calls,
    }),
  );
});
