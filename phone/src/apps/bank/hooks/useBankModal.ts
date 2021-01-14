import { useRecoilState } from 'recoil';
import { bankState } from './state';

interface BankModalProps {
  showBankModal: boolean;
  setShowBankModal: (show: boolean) => void;
}

export const useBankModal = (): BankModalProps => {
  const [ showBankModal, setShowBankModal ] = useRecoilState(bankState.bankModal);
  return { showBankModal, setShowBankModal };
}
