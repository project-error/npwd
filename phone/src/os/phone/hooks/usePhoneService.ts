import { useNuiEvent } from 'fivem-nui-react-lib';
import { useSetRecoilState } from 'recoil';
import { phoneState } from './state';

export const usePhoneService = () => {
  const setVisibility = useSetRecoilState(phoneState.visibility);
  const setPhoneConfig = useSetRecoilState(phoneState.phoneConfig);
  const setPhoneReady = useSetRecoilState(phoneState.phoneReady);
  const setPhoneTime = useSetRecoilState(phoneState.phoneTime);
  useNuiEvent('PHONE', 'setVisibility', setVisibility);
  useNuiEvent('PHONE', 'setPhoneReady', setPhoneReady);
  useNuiEvent('PHONE', 'phoneConfig', setPhoneConfig);
  useNuiEvent('PHONE', 'setTime', setPhoneTime);
};
