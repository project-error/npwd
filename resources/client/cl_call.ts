import { ESX } from './client';
import events from '../utils/events';
import { ICall } from '../../phone/src/common/typings/call';
import config from '../utils/config'
import dayjs from 'dayjs';

const exp = (global as any).exports;

RegisterNuiCallbackType(events.PHONE_INITIALIZE_CALL);
on(`__cfx_nui:${events.PHONE_INITIALIZE_CALL}`, (data: any) => {
  const timestamp = dayjs().locale(config.Locale).format('HH:mm')  
  emitNet(events.PHONE_INITIALIZE_CALL, data.number, timestamp);
});

onNet(
  events.PHONE_START_CALL,
  (transmitter: string, receiver: string, isTransmitter: boolean) => {
    openCallModal(true);

    SendNuiMessage(
      JSON.stringify({
        app: 'CALL',
        method: 'setCaller',
        data: {
          transmitter: transmitter,
          receiver: receiver,
          isTransmitter: isTransmitter,
          accepted: false,
        },
      })
    );
  }
);

RegisterNuiCallbackType(events.PHONE_ACCEPT_CALL);
on(`__cfx_nui:${events.PHONE_ACCEPT_CALL}`, (data: any) => {
  emitNet(events.PHONE_ACCEPT_CALL, data.transmitterNumber);
});

onNet(
  events.PHONE_CALL_WAS_ACCEPTED,
  (channelId: number, currentCall: ICall, isTransmitter: boolean) => {
    exp['mumble-voip'].SetCallChannel(channelId);

    SendNuiMessage(
      JSON.stringify({
        app: 'CALL',
        method: 'setCaller',
        data: {
          transmitter: currentCall.transmitter,
          receiver: currentCall.receiver,
          isTransmitter: isTransmitter,
          accepted: true,
        },
      })
    );
  }
);

RegisterNuiCallbackType(events.PHONE_CALL_REJECTED);
on(`__cfx_nui:${events.PHONE_CALL_REJECTED}`, (data: any) => {
  emitNet(events.PHONE_CALL_REJECTED, data.transmitterNumber);
});

onNet(events.PHONE_CALL_WAS_REJECTED, () => {
  openCallModal(false);

  SendNuiMessage(
    JSON.stringify({
      app: 'CALL',
      method: 'setCaller',
      data: {
        transmitter: null,
        receiver: null,
        isTransmitter: null,
        accepted: false,
      },
    })
  );
});

RegisterNuiCallbackType(events.PHONE_END_CALL);
on(`__cfx_nui:${events.PHONE_END_CALL}`, (data: any) => {
  emitNet(events.PHONE_END_CALL, data.transmitterNumber);
});

onNet(events.PHONE_CALL_WAS_ENDED, () => {
  exp['mumble-voip'].SetCallChannel(0);

  openCallModal(false);

  SendNuiMessage(
    JSON.stringify({
      app: 'CALL',
      method: 'setCaller',
      data: {
        transmitter: null,
        receiver: null,
        isTransmitter: null,
        accepted: false,
      },
    })
  );
});

function openCallModal(show: boolean) {
  SendNuiMessage(
    JSON.stringify({
      app: 'CALL',
      method: 'callModal',
      data: show,
    })
  );
}

onNet(events.PHONE_CALL_SEND_HISTORY, (calls: ICall) => {
  SendNuiMessage(
    JSON.stringify({
      app: 'DAILER',
      method: 'setHistory',
      data: calls,
    })
  );
});
