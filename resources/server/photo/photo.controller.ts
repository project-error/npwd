import { getSource } from '../utils/miscUtils';
import { GalleryPhoto, PhotoEvents } from '../../../typings/photo';
import PhotoService from './photo.service';
import { photoLogger } from './photo.utils';

onNet(PhotoEvents.UPLOAD_PHOTO, async (image: string) => {
  const src = getSource();
  PhotoService.handleUploadPhoto(src, image).catch((e) =>
    photoLogger.error(`Error occurred in upload photo event (${src}), Error: ${e.message}`),
  );
});

onNet(PhotoEvents.FETCH_PHOTOS, async () => {
  const src = getSource();
  PhotoService.handleFetchPhotos(src).catch((e) =>
    photoLogger.error(`Error occurred in upload photo event (${src}), Error: ${e.message}`),
  );
});

onNet(PhotoEvents.DELETE_PHOTO, async (photo: GalleryPhoto) => {
  const src = getSource();
  PhotoService.handleDeletePhoto(src, photo).catch((e) =>
    photoLogger.error(`Error occurred in delete photo event (${src}), Error: ${e.message}`),
  );
});
