import { useRecoilState } from 'recoil';
import { photoState } from './state';

export const usePhotoMeta = () => {
  const [meta, setMeta] = useRecoilState(photoState.photoMeta);
  return { meta, setMeta};
}