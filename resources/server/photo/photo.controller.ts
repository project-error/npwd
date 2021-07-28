import { GalleryPhoto, PhotoEvents } from '../../../typings/photo';
import PhotoService from './photo.service';
import { photoLogger } from './photo.utils';
import { onNetPromise } from '../utils/PromiseNetEvents/onNetPromise';

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

onNetPromise<GalleryPhoto, void>(PhotoEvents.DELETE_PHOTO, (reqObj, resp) => {
  PhotoService.handleDeletePhoto(reqObj, resp).catch((e) => {
    photoLogger.error(
      `Error occurred in delete photo event (${reqObj.source}), Error: ${e.message}`,
    );
    resp({ status: 'error', errorMsg: 'INTERNAL_ERROR' });
  });
});
