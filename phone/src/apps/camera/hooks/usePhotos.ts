import { useRecoilValue } from 'recoil';
import { photoState } from './state';

interface IPhotos {
  image: string[];

  map?: any;
}

export const usePhotos = (): IPhotos | null => {
  const photos = useRecoilValue<IPhotos | null>(photoState.photos);
  return photos;
};
