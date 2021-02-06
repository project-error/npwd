import { useRecoilValue } from 'recoil';
import { photoState } from './state';

export interface ICameraPhoto {
  id: string;
  image: string;
}

export const usePhotos = (): ICameraPhoto[] | null => {
  return useRecoilValue<ICameraPhoto[] | null>(photoState.photos);
};
