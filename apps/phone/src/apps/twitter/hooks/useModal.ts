import { useAtom } from 'jotai';
import { twitterState } from './state';

export const useModal = () => {
  const [modalVisible, setModalVisible] = useAtom(twitterState.showCreateTweetModal);
  const [message, setMessage] = useAtom(twitterState.modalMessage);
  return { modalVisible, setModalVisible, message, setMessage };
};
