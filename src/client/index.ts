import { Client } from 'fivem-router/client';
import {
  BROADCAST_EVENT_LISTENER,
  CLIENT_EVENT_LISTENER,
  NUI_BROADCAST_EVENT,
  NUI_CALLBACK_REGISTER_NAME,
  SERVER_EVENT_LISTENER,
} from '../shared/network';
import PhoneService from './services/PhoneService';

let activeDeviceId = GetPlayerServerId(PlayerId());

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
  PhoneService.close();
  return { ok: true };
});

client.add('/calls/set-channel', async (data: { channel: number }) => {
  PhoneService.setChannel(data.channel);
});

RegisterCommand(
  'select-device',
  async (_: unknown, args: string[]) => {
    const deviceId = parseInt(args[0], 10);
    client.post('/select-device', { deviceId });
  },
  false,
);

/** Server listener */
onNet(BROADCAST_EVENT_LISTENER, (data: { data: unknown; event: string }) => {
  global.SendNUIMessage({ type: NUI_BROADCAST_EVENT, payload: data });
});

RegisterCommand('npwd-toggle-phone', () => PhoneService.togglePhone(), false);
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
