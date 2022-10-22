import { useRecoilState } from 'recoil';
import { callerState } from './state';

interface ModalProps {
  modal: boolean;
  setModal: (show: boolean) => void;
}

export const useCallModal = (): ModalProps => {
  const [modal, setModal] = useRecoilState(callerState.callModal);
  return { modal, setModal };
};
