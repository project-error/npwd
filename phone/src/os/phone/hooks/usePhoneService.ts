import { useNuiEvent } from 'fivem-nui-react-lib';
import { useSetRecoilState } from 'recoil';
import { PhoneEvents } from '../../../../../typings/phone';
import { phoneState } from './state';

export const usePhoneService = () => {
  const setVisibility = useSetRecoilState(phoneState.visibility);
  const setResourceConfig = useSetRecoilState(phoneState.resourceConfig);
  const setPhoneTime = useSetRecoilState(phoneState.phoneTime);
  useNuiEvent('PHONE', PhoneEvents.SET_VISIBILITY, setVisibility);
  useNuiEvent('PHONE', PhoneEvents.SET_CONFIG, setResourceConfig);
  useNuiEvent('PHONE', PhoneEvents.SET_TIME, setPhoneTime);
};
