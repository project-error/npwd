import React from 'react';
import { useNuiEvent } from '../../nui-events/hooks/useNuiEvent';
import { useSetRecoilState } from 'recoil';
import { callerState } from './state';
import { useNotifications } from '../../notifications/hooks/useNotifications';
import { useTranslation } from 'react-i18next';
import { CallNotification } from '../components/CallNotification';
import { useCall } from './useCall';
import { CallProps } from '../../../common/typings/call';
import { useApp } from '../../apps/hooks/useApps';
import InjectDebugData from '../../debug/InjectDebugData';

const NOTIFICATION_ID = 'dialer:currentcall';

InjectDebugData([
  {
    app: 'CALL',
    method: 'setCaller',
    data: {
      accepted: true,
      isTransmitter: true,
      transmitter: 'Chip',
      receiver: 'Taso',
      phone_number: '860-4504',
    },
  },
]);

export const useCallService = () => {
  const { t } = useTranslation();
  const {
    addNotificationAlert,
    removeId,
    addNotification,
  } = useNotifications();

  const { call, setCall } = useCall();

  const { icon, notificationIcon } = useApp('DIALER');

  const setModal = useSetRecoilState(callerState.callModal);

  const callNotificationBase = {
    app: 'DIALER',
    id: NOTIFICATION_ID,
    cantClose: true,
    icon,
    notificationIcon,
    content: <CallNotification />,
    onClick: () => setModal(true),
  };

  const _setCall = (call: CallProps) => {
    setCall(call);
    if (!call) {
      removeId(NOTIFICATION_ID);
      return;
    }
    if (call.accepted) {
      removeId(NOTIFICATION_ID);
      addNotification({
        ...callNotificationBase,
        content: <CallNotification />,
        title: t('APPS_DIALER_CURRENT_CALL_WITH', {
          transmitter: call.transmitter,
        }),
      });
    }
    if (!call.isTransmitter && !call.accepted) {
      addNotificationAlert(
        {
          ...callNotificationBase,
          title: t('APPS_DIALER_TRANSMITTER_IS_CALLING', {
            transmitter: call.transmitter,
          }),
        },
        true
      );
    }
  };

  useNuiEvent<CallProps>('CALL', 'setCaller', _setCall, call);
  useNuiEvent<boolean>('CALL', 'callModal', setModal);
};
