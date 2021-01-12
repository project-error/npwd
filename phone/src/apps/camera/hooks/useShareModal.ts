import { useRecoilState } from 'recoil';
import { photoState } from './state';

export const useShareModal = () => {
  const [shareModal, setShareModal] = useRecoilState(photoState.shareModal);
  return { shareModal, setShareModal };
};
