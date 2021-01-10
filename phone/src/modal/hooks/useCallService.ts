import { useNuiEvent } from '../../os/nui-events/hooks/useNuiEvent';
import { useSetRecoilState } from 'recoil';
import { callerState } from './state';
import { useCall } from './useCall';

export const useCallService = () => {
  const setCaller = useSetRecoilState(callerState.caller);
  useNuiEvent('CALL', 'setCaller', setCaller);
  return useCall();
};
