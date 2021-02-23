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

const NOTIFICATION_ID = 'call:current';

InjectDebugData<CallProps>([
  {
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
    onClick: () => setModal(true),
  };

  const _setCall = (call: CallProps) => {
    setCall(call);
    if (!call || !call.active) {
      removeId(NOTIFICATION_ID);
      return;
    }
    if (call.accepted) {
      removeId(NOTIFICATION_ID);
      addNotification({
        ...callNotificationBase,
        content: (
          <CallNotification>
            {t('APPS_DIALER_CURRENT_CALL_WITH', {
              transmitter: call.transmitter,
            })}
          </CallNotification>
        ),
        title: t('APPS_DIALER_CURRENT_CALL_TITLE'),
      });
    }
    if (!call.isTransmitter && !call.accepted) {
      addNotificationAlert(
        {
          ...callNotificationBase,
          title: t('APPS_DIALER_INCOMING_CALL_TITLE', {
            transmitter: call.transmitter,
          }),
          content: (
            <CallNotification>
              {t('APPS_DIALER_TRANSMITTER_IS_CALLING', {
                transmitter: call.transmitter,
              })}
            </CallNotification>
          ),
        },
        true
      );
    }
  };

  useNuiEvent<CallProps>('CALL', 'setCaller', _setCall, call);
  useNuiEvent<boolean>('CALL', 'callModal', setModal);
};
