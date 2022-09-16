import { useEffect, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { useCall } from './useCall';

import { CallEvents, ActiveCall } from '@typings/call';
import { useCallModal } from './useCallModal';
import { useHistory, useLocation } from 'react-router-dom';
import { callerState } from './state';
import { useNuiEvent } from 'fivem-nui-react-lib';
import { useSetNavigationDisabled } from '@os/navigation-bar/state/navigation.state';
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
  const { modal } = useCallModal();
  const history = useHistory();
  const { pathname } = useLocation();
  const setNavigationDisabled = useSetNavigationDisabled();
  const { setCall, call, endCall } = useCall();

  const { enqueueCallNotification, removeNotification } = useCallNotification();

  const [modalHasBeenOpenedThisCall, setModalOpened] = useState<boolean>(false);

  useEffect(() => {
    setModalOpened(!!modal);
  }, [modal]);

  useEffect(() => {
    const shouldDisable = !call;
    setNavigationDisabled(shouldDisable);
  }, [setNavigationDisabled, call]);

  useEffect(() => {
    if (!modal && pathname === '/call') {
      history.replace('/');
    }
    if (modal && !modalHasBeenOpenedThisCall && pathname !== '/call') {
      history.push('/call');
    }
  }, [history, modal, pathname, modalHasBeenOpenedThisCall]);

  useNuiEvent<ActiveCall | null>('CALL', CallEvents.SET_CALL_INFO, (callData) => {
    setCall(callData);
    if (!callData) return removeNotification();
    enqueueCallNotification(callData);
  });

  //useNuiEvent('CALL', CallEvents.SET_CALL_MODAL, setModal);
  useNuiEvent('CALL', CallEvents.END_CALL, endCall);
};
