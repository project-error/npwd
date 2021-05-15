import { useSetRecoilState } from 'recoil';
import { useNuiEvent } from 'fivem-nui-react-lib';
import { dialState } from './state';
import { CallEvents } from '../../../../../typings/call';
import { IAlert, useSnackbar } from '../../../ui/hooks/useSnackbar';
import { useTranslation } from 'react-i18next';

export const useDialService = () => {
  const { addAlert } = useSnackbar();
  const { t } = useTranslation();

  const handleAddAlert = ({ message, type }: IAlert) => {
    addAlert({
      message: t(`APPS_${message}`),
      type,
    });
  };

  const setHistory = useSetRecoilState(dialState.history);
  useNuiEvent('DIALER', CallEvents.SET_CALL_HISTORY, setHistory);
  useNuiEvent('DAILER', CallEvents.SEND_ALERT, handleAddAlert);
};
