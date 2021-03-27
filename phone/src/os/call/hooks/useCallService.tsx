import { useEffect, useState } from 'react';
import { useNuiEvent } from '../../nui-events/hooks/useNuiEvent';
import { useSetRecoilState } from 'recoil';
import { useCall } from './useCall';
import { CallEvents, CallProps } from '../../../../../typings/call';
import InjectDebugData from '../../debug/InjectDebugData';
import { useCallModal } from './useCallModal';
import { useHistory, useLocation } from 'react-router-dom';
import { callerState } from './state';
import { useCallNotifications } from './useCallNotifications';
import { useDuration } from './useDuration';

InjectDebugData<CallProps | boolean>([
  /*   {
    app: 'CALL',
    method: 'setCaller',
    data: {
      accepted: true,
      isTransmitter: false,
      transmitter: 'Chip',
      receiver: 'Taso',
      active: true,
    },
  },
  {
    app: 'CALL',
    method: 'callModal',
    data: true,
  }, */
]);

export const useCallService = () => {
  const { modal } = useCallModal();
  const history = useHistory();
  const { pathname } = useLocation();

  const { call, setCall } = useCall();
  const { resetDuration } = useDuration();

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
    resetDuration();
    setCall(_call);
    setNotification(_call);
  };
  useNuiEvent<CallProps>('CALL', CallEvents.SET_CALLER, _setCall, call);
  useNuiEvent<boolean>('CALL', CallEvents.SET_CALL_MODAL, setModal);
};
