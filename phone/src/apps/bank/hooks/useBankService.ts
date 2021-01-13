import { useNuiEvent } from '../../../os/nui-events/hooks/useNuiEvent';
import { bankState } from './state';
import { useTransactions } from './useTransactions';
import { useCredentials } from './useCredentials';
import { useBankAlert } from './useBankAlert';
import { useSetRecoilState } from 'recoil';
import { useBankNotification } from './useBankNotification';

export const useBankService = () => {
  const setTransaction = useSetRecoilState(bankState.transactions);
  const setCredentials = useSetRecoilState(bankState.bankCredentials);
  const setAlertMessage = useSetRecoilState(bankState.transferSuccessful);
  const setNotification = useSetRecoilState(bankState.notification);

  ///

  useNuiEvent('BANK', 'setTransaction', setTransaction);
  useNuiEvent('BANK', 'setCredentials', setCredentials);
  useNuiEvent('BANK', 'setAlert', setAlertMessage);
  useNuiEvent('BANK', 'setNotification', setNotification);
  return { useTransactions, useCredentials, useBankAlert, useBankNotification };
};
