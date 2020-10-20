import { useRecoilState } from 'recoil';
import { bankState } from './state';

export const useBankModal = () => {
  const [ showBankModal, setShowBankModal ] = useRecoilState(bankState.bankModal);
  return { showBankModal, setShowBankModal };
}
