import { useNuiEvent } from '../../../os/nui-events/hooks/useNuiEvent';
import { bankState } from './state';
import { useTransactions } from './useTransactions';
import { useCredentials } from './useCredentials';
import { useSetRecoilState } from 'recoil';
import { useBankNotification } from './useBankNotification';
import { useSnackbar } from '../../../ui/hooks/useSnackbar';

export const useBankService = () => {
  const setTransaction = useSetRecoilState(bankState.transactions);
  const setCredentials = useSetRecoilState(bankState.bankCredentials);
  const setNotification = useSetRecoilState(bankState.notification);
  const { addAlert } = useSnackbar();

  useNuiEvent('BANK', 'setTransaction', setTransaction);
  useNuiEvent('BANK', 'setCredentials', setCredentials);
  useNuiEvent('BANK', 'setAlert', addAlert);
  useNuiEvent('BANK', 'setNotification', setNotification);
  return { useTransactions, useCredentials, useBankNotification };
};
