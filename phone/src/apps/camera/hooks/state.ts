import { atom } from 'recoil';
import { IPhoto } from '../../../../../typings/photo';

export const photoState = {
  photos: atom<IPhoto[]>({
    key: 'galleryPhotos',
    default: [],
  }),
};
