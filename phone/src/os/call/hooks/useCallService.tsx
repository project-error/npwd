import { useCall } from './useCall';

import { CallEvents, ActiveCall } from '@typings/call';
import { useNuiEvent } from 'fivem-nui-react-lib';
import { useCallNotification } from '@os/new-notifications/useCallNotification';

// InjectDebugData<CallProps | boolean>([
//   {
//     app: 'CALL',
//     method: CallEvents.SET_CALLER,
//     data: {
//       accepted: true,
//       isTransmitter: false,
//       transmitter: '603-275-8373',
//       receiver: '603-275-4747',
//       active: true,
//     },
//   },
//   {
//     app: 'CALL',
//     method: CallEvents.SET_CALL_MODAL,
//     data: true,
//   },
// ]);

export const useCallService = () => {
  const { setCall, endCall } = useCall();

  const { enqueueCallNotification, removeNotification } = useCallNotification();

  useNuiEvent<ActiveCall | null>('CALL', CallEvents.SET_CALL_INFO, (callData) => {
    setCall(callData);
    if (!callData) return removeNotification();
    enqueueCallNotification(callData);
  });

  //useNuiEvent('CALL', CallEvents.SET_CALL_MODAL, setModal);
  useNuiEvent('CALL', CallEvents.END_CALL, endCall);
};
