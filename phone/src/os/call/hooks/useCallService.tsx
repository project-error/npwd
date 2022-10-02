import { CallEvents, ActiveCall } from '@typings/call';
import { useNuiEvent } from 'fivem-nui-react-lib';
import { useCallNotification } from '@os/new-notifications/useCallNotification';
import { useSetRecoilState } from 'recoil';
import { callerState } from './state';
import { useCall } from './useCall';

export const useCallService = () => {
  const { endCall } = useCall();
  const setCall = useSetRecoilState(callerState.currentCall);

  const { enqueueCallNotification, removeNotification } = useCallNotification();

  useNuiEvent<ActiveCall | null>('CALL', CallEvents.SET_CALL_INFO, (callData) => {
    if (!callData) {
      return removeNotification();
    }

    setCall(callData);
    enqueueCallNotification(callData);
  });

  useNuiEvent('CALL', CallEvents.END_CALL, endCall);
};
