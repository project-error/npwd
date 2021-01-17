import { useNuiEvent } from '../../os/nui-events/hooks/useNuiEvent';
import { useSetRecoilState } from 'recoil';
import { callerState } from './state';
import { useCall } from './useCall';
import { useModal } from './useModal';

export const useCallService = () => {
  const setCaller = useSetRecoilState(callerState.currentCall);
  const setModal= useSetRecoilState(callerState.callModal);

  useNuiEvent('CALL', 'setCaller', setCaller);
  useNuiEvent('CALL', 'callModal', setModal);
  return { useCall, useModal };
};
