import { Client } from 'fivem-router/client';
import {
  BROADCAST_EVENT_LISTENER,
  CLIENT_EVENT_LISTENER,
  NUI_BROADCAST_EVENT,
  NUI_CALLBACK_REGISTER_NAME,
  SERVER_EVENT_LISTENER,
} from '../shared/network';
import AnimationService from './animations';

interface Exports {
  'pma-voice': {
    setCallChannel: (channel: number) => void;
  };
}

let activeDeviceId = GetPlayerServerId(PlayerId());
const _exports = global.exports as Exports;
const pmaExports = {
  setCallChannel: (channel: number) => {
    _exports['pma-voice'].setCallChannel(channel);
  },
};

const client = new Client({
  debug: true,
  listeners: {
    nui: NUI_CALLBACK_REGISTER_NAME,
    server: SERVER_EVENT_LISTENER,
    client: CLIENT_EVENT_LISTENER,
  },
  interceptors: {
    request: ({ data, ...payload }) => {
      console.log('Request interceptor:', {
        ...payload,
        data: {
          ...(typeof data === 'object' ? data : {}),
          deviceId: activeDeviceId,
        },
      });

      return {
        ...payload,
        data: {
          ...(typeof data === 'object' ? data : {}),
          deviceId: activeDeviceId,
        },
      };
    },
  },
});

client.add('/close-phone', async () => {
  isPhoneOpenState = false;
  global.SendNUIMessage({ type: 'SET_PHONE_OPEN', payload: false });
  SetNuiFocus(false, false);
  AnimationService.closePhone();
  return { ok: true };
});

client.add('/calls/set-channel', async (data: { channel: number }) => {
  pmaExports.setCallChannel(data.channel);
  if (data.channel === 0) {
    AnimationService.endCall();
  } else {
    AnimationService.onCall();
  }
});

client.add('/end-call', async () => {
  pmaExports.setCallChannel(0);
  AnimationService.endCall();
});

/** Server listener */
onNet(BROADCAST_EVENT_LISTENER, (data: { data: unknown; event: string }) => {
  global.SendNUIMessage({ type: NUI_BROADCAST_EVENT, payload: data });
});

let isPhoneOpenState = false;

RegisterCommand(
  'npwd-toggle-phone',
  () => {
    if (isPhoneOpenState) {
      isPhoneOpenState = false;
      global.SendNUIMessage({ type: 'SET_PHONE_OPEN', payload: false });
      SetNuiFocus(false, false);
      AnimationService.closePhone();
    } else {
      isPhoneOpenState = true;
      global.SendNUIMessage({ type: 'SET_PHONE_OPEN', payload: true });
      SetNuiFocus(true, true);
      AnimationService.openPhone();
    }
  },
  false,
);

RegisterKeyMapping('npwd-toggle-phone', 'Open Phone', 'keyboard', 'M');

RegisterCommand(
  'register-device',
  async (_: unknown) => {
    const phoneNumber = `07${Math.floor(Math.random() * 100000)}`;
    client.post('/devices/register', { phoneNumber });
  },
  false,
);

client.post('/client-loaded', {});
