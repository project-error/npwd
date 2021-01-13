import { useRecoilState } from 'recoil';
import { contactsState } from './state';

export const useContactModal = () => {
  const [showContactModal, setShowContactModal] = useRecoilState(
    contactsState.showContactsModal
  );
  return { showContactModal, setShowContactModal };
};
