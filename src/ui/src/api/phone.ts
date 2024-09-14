import { CLIENT_CALLBACK_PREFIX } from '../../../shared/network';
import { instance } from '../utils/fetch';

export const closePhone = async () => {
  try {
    await instance.post(`/${CLIENT_CALLBACK_PREFIX}/close-phone`, {});
  } catch (error) {
    console.error('Error closing phone:', error);
  }
};
