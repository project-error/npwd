import { getSource } from '../utils/miscUtils';
import { GalleryPhoto, PhotoEvents } from '../../../typings/photo';
import PhotoService from './photo.service';
import { photoLogger } from './photo.utils';
import { onNetPromise } from '../utils/PromiseNetEvents/onNetPromise';

/*onNet(PhotoEvents.UPLOAD_PHOTO, async (image: string) => {
  const src = getSource();
  PhotoService.handleUploadPhoto(src, image).catch((e) =>
    photoLogger.error(`Error occurred in upload photo event (${src}), Error: ${e.message}`),
  );
});*/

onNetPromise<string, GalleryPhoto>(PhotoEvents.UPLOAD_PHOTO, (reqObj, resp) => {
  PhotoService.handleUploadPhoto(reqObj, resp).catch((e) => {
    photoLogger.error(
      `Error occurred in upload photo event (${reqObj.source}), Error: ${e.message}`,
    );
    resp({ status: 'error', errorMsg: 'INTERNAL_ERROR' });
  });
});

onNetPromise<void, GalleryPhoto[]>(PhotoEvents.FETCH_PHOTOS, (reqObj, resp) => {
  PhotoService.handleFetchPhotos(reqObj, resp).catch((e) => {
    photoLogger.error(
      `Error occurred in upload photo event (${reqObj.source}), Error: ${e.message}`,
    );
    resp({ status: 'error', errorMsg: 'INTERNAL_ERROR' });
  });
});

/*onNet(PhotoEvents.FETCH_PHOTOS, async () => {
  const src = getSource();
  PhotoService.handleFetchPhotos(src).catch((e) =>
    photoLogger.error(`Error occurred in upload photo event (${src}), Error: ${e.message}`),
  );
});*/

onNetPromise<GalleryPhoto, void>(PhotoEvents.DELETE_PHOTO, (reqObj, resp) => {
  PhotoService.handleDeletePhoto(reqObj, resp).catch((e) => {
    photoLogger.error(
      `Error occurred in delete photo event (${reqObj.source}), Error: ${e.message}`,
    );
    resp({ status: 'error', errorMsg: 'INTERNAL_ERROR' });
  });
});

/*onNet(PhotoEvents.DELETE_PHOTO, async (photo: GalleryPhoto) => {
  const src = getSource();
  PhotoService.handleDeletePhoto(src, photo).catch((e) =>
    photoLogger.error(`Error occurred in delete photo event (${src}), Error: ${e.message}`),
  );
});*/
