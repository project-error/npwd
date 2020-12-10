import { useRecoilState } from 'recoil';
import { photoState } from './state';

export const usePhotoModal = () => {
  const [modal, setModal] = useRecoilState(photoState.modal);
  return { modal, setModal}
}