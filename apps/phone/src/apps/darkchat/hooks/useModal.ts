import { useRecoilState } from 'recoil';
import { darkChatState } from '../state/state';

export const useModal = () => {
  const [modalVisible, setModalVisible] = useRecoilState(darkChatState.showUploadMediaModal);
  const [modalMedia, setModalMedia] = useRecoilState(darkChatState.modalMedia);
  const [ownerModal, setOwnerModal] = useRecoilState<boolean>(darkChatState.showOwnerModal);

  return { modalVisible, setModalVisible, modalMedia, setModalMedia, ownerModal, setOwnerModal };
};
