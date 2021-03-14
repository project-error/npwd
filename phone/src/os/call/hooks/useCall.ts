import { useRecoilState } from 'recoil';
import { CallProps } from '../../../../../typings/call';
import Nui from '../../nui-events/utils/Nui';
import { callerState } from './state';

interface CallHook {
  call: CallProps;
  setCall: (details: any) => void;
  acceptCall(): void;
  rejectCall(): void;
  endCall(): void;
}

export const useCall = (): CallHook => {
  const [call, setCall] = useRecoilState(callerState.currentCall);

  const acceptCall = () => {
    Nui.send('phone:acceptCall', {
      transmitterNumber: call.transmitter,
    });
  };

  const rejectCall = () => {
    Nui.send('phone:rejectCall', {
      phoneNumber: call.transmitter,
    });
  };

  const endCall = () => {
    Nui.send('phone:endCall', {
      transmitterNumber: call.transmitter,
    });
  };

  return { call, setCall, acceptCall, rejectCall, endCall };
};
