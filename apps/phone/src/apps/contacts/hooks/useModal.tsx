import { useRecoilState } from 'recoil';
import { showMoneyModal } from './state';

export const useModal = () => {
  const [contactPayModal, setContactPayModal] = useRecoilState<boolean>(showMoneyModal);

  return { contactPayModal, setContactPayModal };
};