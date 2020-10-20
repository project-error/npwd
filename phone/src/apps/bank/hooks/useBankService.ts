import { useNuiEvent } from '../../../os/nui-events/hooks/useNuiEvent';
import { bankState } from './state';
import { useTransactions } from './useTransactions'
import { useSetRecoilState } from 'recoil'

export const useBankService = () => {
  const setTransaction = useSetRecoilState(bankState.transactions)
  useNuiEvent('BANK', 'setTransaction', setTransaction);
  return useTransactions;
}