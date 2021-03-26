import { useRecoilValue } from 'recoil';
import { phoneState } from './state';

const usePhoneTime = () => {
  return useRecoilValue<null | string>(phoneState.phoneTime);
};

export default usePhoneTime;
