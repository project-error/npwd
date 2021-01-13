import { useRecoilState } from 'recoil';
import { photoState } from './state';

export const useShareLink = () => {
  const [shareLink, setShareLink] = useRecoilState(photoState.shareLink);
  return { shareLink, setShareLink };
};
