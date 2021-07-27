import { useRecoilState } from 'recoil';
import { ActiveCall } from '../../../../../typings/call';
import { callerState } from './state';
import { CallEvents } from '../../../../../typings/call';
import { fetchNui } from '../../../utils/fetchNui';
import { useCallback } from 'react';
import { useMyPhoneNumber } from '../../simcard/hooks/useMyPhoneNumber';
import { useDialingSound } from './useDialingSound';

interface CallHook {
  call: ActiveCall;
  setCall: (details: any) => void;
  acceptCall(): void;
  rejectCall(): void;
  endCall(): void;
}

export const useCall = (): CallHook => {
  const [call, setCall] = useRecoilState(callerState.currentCall);
  const myPhoneNumber = useMyPhoneNumber();
  const { endDialTone, startDialTone } = useDialingSound();

  const acceptCall = useCallback(() => {
    fetchNui(CallEvents.ACCEPT_CALL, {
      transmitterNumber: call.transmitter,
    });
  }, [call]);

  const rejectCall = useCallback(() => {
    fetchNui(CallEvents.REJECTED, {
      transmitterNumber: call.transmitter,
    });
  }, [call]);

  const endCall = useCallback(() => {
    fetchNui(CallEvents.END_CALL, {
      transmitterNumber: call.transmitter,
      isTransmitter: call.transmitter === myPhoneNumber,
    });
  }, [call, myPhoneNumber]);

  return { call, setCall, acceptCall, rejectCall, endCall };
};
