import { useNuiEvent } from 'fivem-nui-react-lib';
import { CallEvents } from '../../../../../typings/call';
import { IAlert, useSnackbar } from '../../../ui/hooks/useSnackbar';
import { useTranslation } from 'react-i18next';

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
