import { useNuiEvent } from '../../os/nui-events/hooks/useNuiEvent';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { callerState } from './state';

export const useCallService = () => {
  const [caller, setCaller] = useRecoilState(callerState.currentCall);
  const setModal = useSetRecoilState(callerState.callModal);

  useNuiEvent('CALL', 'setCaller', setCaller, {}, caller);
  useNuiEvent('CALL', 'callModal', setModal);
};
