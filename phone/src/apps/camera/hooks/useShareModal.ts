import { useRecoilState } from 'recoil';
import { photoState } from './state';

interface ShareModalProps {
  shareModal: boolean;
  setShareModal: (show: boolean) => void;
}

export const useShareModal = (): ShareModalProps => {
  const [ shareModal, setShareModal ] = useRecoilState(photoState.shareModal);
  return { shareModal, setShareModal }
}
