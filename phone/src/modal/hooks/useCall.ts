import { useRecoilState } from 'recoil';
import { CallProps } from '../../common/typings/call';
import { callerState } from './state';

interface CallHook {
  call: CallProps;
  setCall: (details: any) => void;
}

export const useCall = (): CallHook => {
  const [call, setCall] = useRecoilState(callerState.currentCall);
  return { call, setCall };
};
