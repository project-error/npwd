import { Call, CallWithPhoneNumbers, DeviceWithSimCard } from '../../../shared/Types';
import { StringifyDates } from '../../../shared/TypeUtils';
import { instance } from '../utils/fetch';

export const getCurrentDevice = async () => {
  const response = await instance.post<{ payload: DeviceWithSimCard }>('/devices/current', {});
  return response.data;
};

export const getDevices = async () => {
  const response = await instance.post<{ payload: DeviceWithSimCard[] }>('/devices', {});
  return response.data;
};

export const getMyCalls = async () => {
  const response = await instance.post<{ payload: StringifyDates<Call>[] }>('/calls/my-calls', {});
  return response.data;
};

export const getActiveCall = async () => {
  try {
    const response = await instance.post<{ payload: StringifyDates<CallWithPhoneNumbers> }>(
      '/calls/active',
      {},
    );
    return response.data;
  } catch (error) {
    console.error('Error from getActiveCall:', error);
    return { payload: null };
  }
};
