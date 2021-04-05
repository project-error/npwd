import { atom } from 'recoil';

export const photoState = {
  photos: atom({
    key: 'galleryPhotos',
    default: [],
  }),
};
