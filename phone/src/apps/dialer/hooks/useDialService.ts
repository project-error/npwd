import { CallEvents, CallHistoryItem } from '@typings/call';
import { IAlert, useSnackbar } from '@os/snackbar/hooks/useSnackbar';
import { useTranslation } from 'react-i18next';
import { useNuiEvent } from '@common/hooks/useNuiEvent';
import { dialState, useSetHistory } from './state';
import { useRecoilCallback } from 'recoil';

export const useDialService = () => {
  const { addAlert } = useSnackbar();
  const setHistory = useSetHistory();
  const [t] = useTranslation();

  const handleAddAlert = ({ message, type }: IAlert) => {
    addAlert({
      message: t(`APPS_${message}`),
      type,
    });
  };

  const saveCall = useRecoilCallback(
    ({ snapshot }) =>
      (callObj: CallHistoryItem) => {
        const { state } = snapshot.getLoadable(dialState.history);

        if (state !== 'hasValue') return;

        // If label is forwarded through ctx.forward, put that as the transmitter otherwise the character it got forwarded to will be shown in history.
        setHistory((curHistory) => [
          { ...callObj, transmitter: callObj.label || callObj.transmitter },
          ...curHistory,
        ]);
      },
    [],
  );

  useNuiEvent('DIALER', CallEvents.WAS_ACCEPTED, saveCall);
  useNuiEvent('DIALER', CallEvents.WAS_REJECTED, saveCall);
  useNuiEvent('DIALER', CallEvents.SEND_ALERT, handleAddAlert);
};
