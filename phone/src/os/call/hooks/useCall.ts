import { ActiveCall } from '@typings/call';
import { useCurrentCall } from './state';
import { CallEvents } from '@typings/call';
import fetchNui from '@utils/fetchNui';
import { useCallback } from 'react';
import { useMyPhoneNumber } from '@os/simcard/hooks/useMyPhoneNumber';
import { useSnackbar } from '@os/snackbar/hooks/useSnackbar';
import { useTranslation } from 'react-i18next';
import { ServerPromiseResp } from '@typings/common';

interface CallHook {
  call: ActiveCall;
  setCall: (call: ActiveCall) => void;
  acceptCall(): void;
  rejectCall(): void;
  endCall(): void;
  initializeCall(number: string): void;
  muteCall(state: boolean): void;
}

// const TIME_TILL_AUTO_HANGUP = 15000;

export const useCall = (): CallHook => {
  const [call, setCall] = useCurrentCall();
  const myPhoneNumber = useMyPhoneNumber();
  const [t] = useTranslation();
  const { addAlert } = useSnackbar();

  const initializeCall = useCallback(
    (number) => {
      // We allow calling of ourselves in development
      if (process.env.NODE_ENV !== 'development' && myPhoneNumber === number) {
        return addAlert({ message: t('CALLS.FEEDBACK.ERROR_MYSELF'), type: 'error' });
      }

      fetchNui<ServerPromiseResp<ActiveCall>>(CallEvents.INITIALIZE_CALL, {
        receiverNumber: number,
      }).then((resp) => {
        if (resp.status !== 'ok') {
          addAlert({ message: t('CALLS.FEEDBACK.ERROR'), type: 'error' });
          console.error(resp.errorMsg);
          return;
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
      isUnavailable: call.isUnavailable,
      isTransmitter: call.transmitter === myPhoneNumber,
    });
  }, [call, myPhoneNumber]);

  const muteCall = useCallback(
    (state) => {
      fetchNui(CallEvents.TOGGLE_MUTE_CALL, {
        call,
        state,
      });
    },
    [call],
  );

  return { call, setCall, acceptCall, rejectCall, endCall, initializeCall, muteCall };
};
