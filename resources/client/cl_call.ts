import { ESX } from './client';
import events from '../utils/events';

const exp = (global as any).exports;

RegisterNuiCallbackType(events.PHONE_BEGIN_CALL);
on(`__cfx_nui:${events.PHONE_BEGIN_CALL}`, (data: any) => {
  console.log('PHONE NUMBER YOU ARE TRYING TO CALL', data.number);
  emitNet(events.PHONE_BEGIN_CALL, data.number);
});

onNet(
  events.PHONE_START_CALL,
  (target: string, phoneNumber: string, isTransmitter: boolean) => {
    console.log(
      `You are talking to ${target} who has the number ${phoneNumber}`
    );
    //exp["mumble-voip"].SetCallChannel(id+1);
    SendNuiMessage(
      JSON.stringify({
        app: 'CALL',
        method: 'callModal',
        data: true,
      })
    );
    SendNuiMessage(
      JSON.stringify({
        app: 'CALL',
        method: 'setCaller',
        data: {
          target: target,
          caller: phoneNumber,
          transmitter: isTransmitter,
          accepted: false,
        },
      })
    );
  }
);

RegisterNuiCallbackType(events.PHONE_ACCEPT_CALL);
on(`__cfx_nui:${events.PHONE_ACCEPT_CALL}`, (data: any) => {
  console.log(data)
  emitNet(events.PHONE_ACCEPT_CALL, data.phoneNumber);
});

onNet('phone:callAccepted', (id: number) => {
  exp['mumble-voip'].SetCallChannel(id);
});


RegisterNuiCallbackType(events.PHONE_END_CALL);
on(`__cfx_nui:${events.PHONE_END_CALL}`, (data: any) => {
  emitNet(events.PHONE_END_CALL, data.phoneNumber);
})

onNet(events.PHONE_CALL_WAS_ENDED, () => {
  console.log("Call ended");
  exp["mumble-voip"].SetCallChannel(0);
});


RegisterNuiCallbackType(events.PHONE_CALL_REJECTED)
on(`__cfx_nui:${events.PHONE_CALL_REJECTED}`, (data: any) => {
  emit(events.PHONE_CALL_REJECTED, data.phoneNumber)
})

onNet(events.PHONE_CALL_WAS_REJECTED, () => {
  SendNuiMessage(
    JSON.stringify({
      app: 'CALL',
      method: 'callModal',
      data: false,
    })
  );
  SendNuiMessage(
    JSON.stringify({
      app: 'CALL',
      method: 'setCaller',
      data: {
        target: null,
        caller: null,
        transmitter: null,
        accepted: false,
      },
    })
  );
})