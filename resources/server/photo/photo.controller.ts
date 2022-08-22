import { GalleryPhoto, PhotoEvents } from '../../../typings/photo';
import PhotoService from './photo.service';
import { photoLogger } from './photo.utils';
import { onNetPromise } from '../lib/PromiseNetEvents/onNetPromise';

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

onNetPromise<number[], void>(PhotoEvents.DELETE_MULTIPLE_PHOTOS, (reqObj, resp) => {
  PhotoService.handleDeleteMultiplePhotos(reqObj, resp).catch((e) => {
    photoLogger.error(
      `Error occurred in delete multiple photos event (${reqObj.source}), Error: ${e.message}`,
    );
    resp({ status: 'error', errorMsg: 'INTERNAL_ERROR' });
  });
});

onNetPromise<{ url: string }, GalleryPhoto>(PhotoEvents.SAVE_IMAGE, (reqObj, resp) => {
  PhotoService.handleSaveImage(reqObj, resp).catch((e) => {
    photoLogger.error(`Error occurred in save image event (${reqObj.source}), Error: ${e.message}`);
    resp({ status: 'error', errorMsg: 'INTERNAL_ERROR' });
  });
});

onNetPromise<void, string>(PhotoEvents.GET_AUTHORISATION_TOKEN, (reqObj, resp) => {
  resp({
    status: 'ok',
    data: GetConvar('SCREENSHOT_BASIC_TOKEN', 'none'),
  });
});
