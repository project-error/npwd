import { useRecoilState } from 'recoil';
import { twitterState } from './state';

export const useModal = () => {
  const [modalVisible, setModalVisible] = useRecoilState(
    twitterState.showCreateTweetModal,
  );
  const [message, setMessage] = useRecoilState(twitterState.modalMessage);
  return { modalVisible, setModalVisible, message, setMessage };
};
