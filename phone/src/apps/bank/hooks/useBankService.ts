import { useNuiEvent } from '../../../os/nui-events/hooks/useNuiEvent';
import { bankState } from './state';
import { useTransactions } from './useTransactions';
import { useCredentials } from './useCredentials';
import { useSetRecoilState } from 'recoil';
import { useBankNotification } from './useBankNotification';
import { IAlert, useSnackbar } from '../../../ui/hooks/useSnackbar';
import { useTranslation } from 'react-i18next';

export const useBankService = () => {
  const setTransaction = useSetRecoilState(bankState.transactions);
  const setCredentials = useSetRecoilState(bankState.bankCredentials);
  const setNotification = useSetRecoilState(bankState.notification);
  const { addAlert } = useSnackbar();
  const { t } = useTranslation();

  const handleAddAlert = ({ message, type }: IAlert) => {
    addAlert({
      message: t(`APPS_${message}`),
      type,
    });
  };

  useNuiEvent('BANK', 'setTransaction', setTransaction);
  useNuiEvent('BANK', 'setCredentials', setCredentials);
  useNuiEvent('BANK', 'setAlert', handleAddAlert);
  useNuiEvent('BANK', 'setNotification', setNotification);
  return { useTransactions, useCredentials, useBankNotification };
};
