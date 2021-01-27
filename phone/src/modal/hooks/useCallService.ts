import { useNuiEvent } from '../../os/nui-events/hooks/useNuiEvent';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { callerState } from './state';
import { useCall } from './useCall';
import { useModal } from './useModal';

export const useCallService = () => {
  const [caller, setCaller] = useRecoilState(callerState.currentCall);
  const setModal = useSetRecoilState(callerState.callModal);

  useNuiEvent('CALL', 'setCaller', setCaller, {}, caller);
  useNuiEvent('CALL', 'callModal', setModal);
  return { useCall, useModal };
};
 