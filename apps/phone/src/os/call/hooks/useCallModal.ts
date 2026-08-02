import { useAtom } from 'jotai';
import { callerState } from './state';

interface ModalProps {
  modal: boolean;
  setModal: (show: boolean) => void;
}

export const useCallModal = (): ModalProps => {
  const [modal, setModal] = useAtom(callerState.callModal);
  return { modal, setModal };
};
