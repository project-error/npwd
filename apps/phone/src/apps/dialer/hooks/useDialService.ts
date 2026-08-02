import { CallEvents, CallHistoryItem } from '@typings/call';
import { IAlert, useSnackbar } from '@os/snackbar/hooks/useSnackbar';
import { useTranslation } from 'react-i18next';
import { useNuiEvent } from '@common/hooks/useNuiEvent';
import { useSetHistory } from './state';
import { useCallback } from 'react';

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

  const saveCall = useCallback(
    (callObj: CallHistoryItem) => {
      setHistory((curHistory) => [callObj, ...curHistory]);
    },
    [setHistory],
  );

  useNuiEvent('DIALER', CallEvents.WAS_ACCEPTED, saveCall);
  useNuiEvent('DIALER', CallEvents.WAS_REJECTED, saveCall);
  useNuiEvent('DIALER', CallEvents.SEND_ALERT, handleAddAlert);
};
