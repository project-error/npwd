import { useRecoilState } from 'recoil';
import { contactsState } from './state';

interface ModalProps {
  showContactModal: boolean:
  setShowContactModal: (show: boolean) => void;
}

export const useContactModal = (): ModalProps => {
  const [ showContactModal, setShowContactModal ] = useRecoilState(contactsState.showContactsModal);
  return { showContactModal, setShowContactModal };
}