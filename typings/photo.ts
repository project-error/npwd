export interface GalleryPhoto {
  image: string;
  id: number;
}

export enum PhotoEvents {
  TAKE_PHOTO = 'npwd:TakePhoto',
  CAMERA_EXITED = 'npwd:cameraExited',
  NPWD_PHOTO_MODE_STARTED = 'npwd:PhotoModeStarted',
  NPWD_PHOTO_MODE_ENDED = 'npwd:PhotoModeEnded',
  TAKE_PHOTO_SUCCESS = 'npwd:TakePhotoSuccess',
  UPLOAD_PHOTO = 'npwd:UploadPhoto',
  FETCH_PHOTOS = 'npwd:FetchPhotos',
  DELETE_PHOTO = 'npwd:deletePhoto',
}
