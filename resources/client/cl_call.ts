import { ESX } from "./client";
import events from "../utils/events";

const exp = (global as any).exports;

RegisterNuiCallbackType(events.PHONE_BEGIN_CALL);
on(`__cfx_nui:${events.PHONE_BEGIN_CALL}`, (data: any) => {
  console.log('PHONE NUMBER YOU ARE TRYING TO CALL', data.number);
  emitNet(events.PHONE_BEGIN_CALL, data.number);
});

onNet(events.PHONE_START_CALL, (target: string, phoneNumber: string, isTransmitter: boolean, id: any) => {
  console.log(`You are talking to ${target} who has the number ${phoneNumber}`);
  exp["mumble-voip"].SetCallChannel(id+1);
  SendNuiMessage(
    JSON.stringify({
      app: "CALL",
      method: "callModal",
      data: true
    })
  )
  SendNuiMessage(
    JSON.stringify({
      app: "CALL",
      method: "setCaller",
      data: {
        target: target,
        caller: phoneNumber,
        transmitter: isTransmitter,
        accepted: false 
      }
    })
  )
});


RegisterNuiCallbackType(events.PHONE_ACCEPT_CALL);
on(`__cfx_nui:${events.PHONE_ACCEPT_CALL}`, (data: any) => {
  emitNet(events.PHONE_ACCEPT_CALL, data.phoneNumber)
})

onNet('phone:callAccepted', (id: number) => {
  exp["mumble-voip"].SetRadioChannel(id);
})




/* onNet(events.PHONE_CALL_WAS_ENDED, () => {
  console.log("Call ended");
  exp["mumble-voip"].SetCallChannel(0);
}); */
