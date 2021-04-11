import { atom } from 'recoil';
import { GalleryPhoto } from '../../../../../typings/photo';

export const photoState = {
  photos: atom<GalleryPhoto[]>({
    key: 'galleryPhotos',
    default: [],
  }),
};
