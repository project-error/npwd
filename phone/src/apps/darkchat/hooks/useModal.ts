import { useRecoilState } from 'recoil';
import { darkChatState } from '../state/state';

export const useModal = () => {
  const [modalVisible, setModalVisible] = useRecoilState(darkChatState.showUploadMediaModal);
  const [modalMedia, setModalMedia] = useRecoilState(darkChatState.modalMedia);

  return { modalVisible, setModalVisible, modalMedia, setModalMedia };
};
