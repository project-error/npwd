import { useRecoilState } from 'recoil';
import { showMoneyModal } from './state';

export const useModal = () => {
  const [contactPayModal, setcontactPayModal] = useRecoilState<boolean>(showMoneyModal);

  return { contactPayModal, setcontactPayModal };
};