import { useRecoilState } from 'recoil';
import { messageState } from './state';

export const useImageModal = () => {
  const [imageModal, setImageModal] = useRecoilState(messageState.imageModal);
  return { imageModal, setImageModal };
};
