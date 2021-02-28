import { useCallback, useEffect, useState } from 'react';
import { useNuiEvent } from '../../nui-events/hooks/useNuiEvent';
import { useSetRecoilState } from 'recoil';
import { callerState } from './state';
import { useCall } from './useCall';
import { CallProps } from '../../../common/typings/call';
import InjectDebugData from '../../debug/InjectDebugData';
import { useCallModal } from './useCallModal';
import { useHistory, useLocation } from 'react-router-dom';
import { useCallNotifications } from './useCallNotifications';

InjectDebugData<CallProps | boolean>([
  /*   {
    app: 'CALL',
    method: 'setCaller',
    data: {
      accepted: false,
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
  const history = useHistory();
  const { pathname } = useLocation();

  const { call, setCall } = useCall();
  const { modal } = useCallModal();
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

  const _setCall = useCallback(
    (_call) => {
      setNotification(_call);
      setCall(_call);
    },
    [setCall, setNotification]
  );

  useNuiEvent<CallProps>('CALL', 'setCaller', _setCall, call);
  useNuiEvent<boolean>('CALL', 'callModal', setModal);
};
