import { useAtom } from 'jotai';
import { showMoneyModal } from './state';

export const useModal = () => {
  const [contactPayModal, setContactPayModal] = useAtom(showMoneyModal);

  return { contactPayModal, setContactPayModal };
};