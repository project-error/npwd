import { useRecoilValue } from "recoil";
import { bankState } from './state'; 

export const useTransactions = () => {
  const transactionList = useRecoilValue(bankState.transactions);
  return { transactionList };
};
