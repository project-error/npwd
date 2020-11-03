import { useNuiEvent } from '../../../os/nui-events/hooks/useNuiEvent';
import { bankState } from './state';
import { useTransactions } from './useTransactions'
import { useCredentials } from './useCredentials';
import { useBankAlert } from './useBankAlert';
import { useSetRecoilState } from 'recoil'

export const useBankService = () => {
  const setTransaction = useSetRecoilState(bankState.transactions)
  const setCredentials = useSetRecoilState(bankState.bankCredentials)
  const setAlertMessage = useSetRecoilState(bankState.bankAlert)
  useNuiEvent('BANK', 'setTransaction', setTransaction);
  useNuiEvent('BANK', 'setCredentials', setCredentials)
  useNuiEvent('BANK', 'setAlert', setAlertMessage)
  return {useTransactions, useCredentials, useBankAlert};
}