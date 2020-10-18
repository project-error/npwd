import { useRecoilState } from "recoil";
import { contactsState } from "./state";

export const useModal = () => {
  const [showModal, setShowModal] = useRecoilState(contactsState.showModal);
  return { showModal, setShowModal };
};
