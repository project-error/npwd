import { CallEvents } from '@typings/call';
import { IAlert, useSnackbar } from '@os/snackbar/hooks/useSnackbar';
import { useTranslation } from 'react-i18next';
import { useNuiEvent } from '@common/hooks/useNuiEvent';

export const useDialService = () => {
  const { addAlert } = useSnackbar();
  const [t] = useTranslation();

  const handleAddAlert = ({ message, type }: IAlert) => {
    addAlert({
      message: t(`APPS_${message}`),
      type,
    });
  };

  useNuiEvent('DIALER', CallEvents.SEND_ALERT, handleAddAlert);
};
