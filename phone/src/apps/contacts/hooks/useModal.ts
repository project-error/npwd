import { useRecoilState } from "recoil";
import { contactsState } from "./state";

interface ModalProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
}

export const useModal = () => {
  const [showModal, setShowModal] = useRecoilState(contactsState.showModal);
  return { showModal, setShowModal };
};
