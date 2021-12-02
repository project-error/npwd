import { useRecoilValue } from 'recoil';
import { ITransactions } from '@typings/bank';
import { bankState } from './state';

export const useTransactions = () => {
  return useRecoilValue<ITransactions[]>(bankState.transactions);
};
