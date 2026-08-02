import { useAtom } from 'jotai';
import { darkChatState } from '../state/state';

export const useModal = () => {
  const [modalVisible, setModalVisible] = useAtom(darkChatState.showUploadMediaModal);
  const [modalMedia, setModalMedia] = useAtom(darkChatState.modalMedia);
  const [ownerModal, setOwnerModal] = useAtom(darkChatState.showOwnerModal);

  return { modalVisible, setModalVisible, modalMedia, setModalMedia, ownerModal, setOwnerModal };
};
