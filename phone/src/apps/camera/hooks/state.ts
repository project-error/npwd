import { atom } from 'recoil';

export const photoState = {
  photos: atom({
    key: 'galleryPhotos',
    default: null,
  }),
  modal: atom({
    key: 'photoModal',
    default: false,
  }),
  photoMeta: atom({
    key: 'photoMeta',
    default: null,
  }),
  shareModal: atom({
    key: 'phoneShareModal',
    default: false,
  }),
  shareLink: atom({
    key: 'photoShareLink',
    default: null,
  }),
};
