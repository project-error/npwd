import { useRecoilState } from 'recoil';
import { bankState } from './state';

export const useBankAlert = () => {
  const [ bankAlert, setBankAlert ] =  useRecoilState(bankState.bankAlert);
  return { bankAlert, setBankAlert };
}