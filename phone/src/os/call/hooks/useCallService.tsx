import { useEffect, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { useCall } from './useCall';
import { CallEvents, CallProps } from '../../../../../typings/call';
// import InjectDebugData from '../../debug/InjectDebugData';
import { useCallModal } from './useCallModal';
import { useHistory, useLocation } from 'react-router-dom';
import { callerState } from './state';
import { useCallNotifications } from './useCallNotifications';
import { useNuiEvent } from 'fivem-nui-react-lib';

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

  const { call, setCall } = useCall();

  const { setNotification } = useCallNotifications();

  const setModal = useSetRecoilState(callerState.callModal);

  const [modalHasBeenOpenedThisCall, setModalOpened] = useState<boolean>(false);

  useEffect(() => {
    setModalOpened(!!modal);
  }, [modal]);

  useEffect(() => {
    if (!modal && pathname === '/call') {
      history.replace('/');
    }
    if (modal && !modalHasBeenOpenedThisCall && pathname !== '/call') {
      history.push('/call');
    }
  }, [history, modal, pathname, modalHasBeenOpenedThisCall]);

  const _setCall = (_call: CallProps) => {
    setCall({ ...call, ..._call });
    setNotification(_call);
  };
  useNuiEvent('CALL', CallEvents.SET_CALLER, _setCall);
  useNuiEvent('CALL', CallEvents.SET_CALL_MODAL, setModal);
};
