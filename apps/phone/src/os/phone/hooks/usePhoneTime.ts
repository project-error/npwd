import { useAtomValue } from 'jotai';
import { phoneState } from './state';

const usePhoneTime = () => {
  return useAtomValue(phoneState.phoneTime);
};

export default usePhoneTime;
