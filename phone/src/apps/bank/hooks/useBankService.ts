import { useNuiEvent } from '../../../os/nui-events/hooks/useNuiEvent';
import { bankState } from './state';
import { useTransactions } from './useTransactions'
import { useCredentials } from './useCredentials';
import { useSetRecoilState } from 'recoil'

export const useBankService = () => {
  const setTransaction = useSetRecoilState(bankState.transactions)
  const setCredentials = useSetRecoilState(bankState.bankCredentials)
  useNuiEvent('BANK', 'setTransaction', setTransaction);
  useNuiEvent('BANK', 'setCredentials', setCredentials)
  return {useTransactions, useCredentials};
}