import { ActiveCall } from '../../../../../typings/call';
import { useCurrentCall } from './state';
import { CallEvents } from '../../../../../typings/call';
import { fetchNui } from '../../../utils/fetchNui';
import { useCallback } from 'react';
import { useMyPhoneNumber } from '../../simcard/hooks/useMyPhoneNumber';
import { useSnackbar } from '../../../ui/hooks/useSnackbar';
import { useTranslation } from 'react-i18next';
import { ServerPromiseResp } from '../../../../../typings/common';

interface CallHook {
  call: ActiveCall;
  setCall: (call: ActiveCall) => void;
  acceptCall(): void;
  rejectCall(): void;
  endCall(): void;
  initializeCall(number: string): void;
}

// const TIME_TILL_AUTO_HANGUP = 15000;

export const useCall = (): CallHook => {
  const [call, setCall] = useCurrentCall();
  // const [dialRing, setDialRing] = useState(false);
  const myPhoneNumber = useMyPhoneNumber();
  const { t } = useTranslation();
  const { addAlert } = useSnackbar();
  // const { endDialTone, startDialTone } = useDialingSound();

  const initializeCall = useCallback(
    (number) => {
      // We allow calling of ourselves in development
      if (process.env.NODE_ENV !== 'development' && myPhoneNumber === number) {
        return addAlert({ message: t('CALLS.FEEDBACK.ERROR_MYSELF'), type: 'error' });
      }

      fetchNui<ServerPromiseResp>(CallEvents.INITIALIZE_CALL, {
        receiverNumber: number,
      }).then((resp) => {
        if (resp.status === 'error') {
          addAlert({ message: t('CALLS.FEEDBACK.ERROR'), type: 'error' });
          console.error(resp.errorMsg);
        }
      });
    },
    [addAlert, myPhoneNumber, t],
  );

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

  return { call, setCall, acceptCall, rejectCall, endCall, initializeCall };
};
