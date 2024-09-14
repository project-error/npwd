import { CLIENT_CALLBACK_PREFIX } from '../../../shared/network';
import { instance } from '../utils/fetch';

export const setCallChannel = async (channel: number) => {
  try {
    await instance.post(`/${CLIENT_CALLBACK_PREFIX}/calls/set-channel`, { channel });
  } catch (error) {
    console.error('Error setting call channel:', error);
  }
};
