import { useRecoilState } from 'recoil';
import { CallProps } from '../../../../../typings/call';
import { callerState } from './state';
import { CallEvents } from '../../../../../typings/call';
import { useNuiRequest } from 'fivem-nui-react-lib';

interface CallHook {
  call: CallProps;
  setCall: (details: any) => void;
  acceptCall(): void;
  rejectCall(): void;
  endCall(): void;
}

export const useCall = (): CallHook => {
  const Nui = useNuiRequest();
  const [call, setCall] = useRecoilState(callerState.currentCall);

  const acceptCall = () => {
    Nui.send(CallEvents.ACCEPT_CALL, {
      transmitterNumber: call.transmitter,
    });
  };

  const rejectCall = () => {
    Nui.send(CallEvents.REJECTED, {
      phoneNumber: call.transmitter,
    });
  };

  const endCall = () => {
    Nui.send(CallEvents.END_CALL, {
      transmitterNumber: call.transmitter,
    });
  };

  return { call, setCall, acceptCall, rejectCall, endCall };
};
