import { useSetRecoilState } from 'recoil';
import { phoneState } from './state';
import { useNuiEvent } from '../../nui-events/hooks/useNuiEvent';

export const usePhoneService = () => {
  const setVisibility = useSetRecoilState(phoneState.visibility);
  const setPhoneConfig = useSetRecoilState(phoneState.phoneConfig);
  const setPhoneReady = useSetRecoilState(phoneState.phoneReady);
  useNuiEvent('PHONE', 'setVisibility', setVisibility);
  useNuiEvent('PHONE', 'setPhoneReady', setPhoneReady);
  useNuiEvent('PHONE', 'phoneConfig', setPhoneConfig);
};
