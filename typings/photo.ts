export interface GalleryPhoto {
  image: string;
  id: number;
}

export enum PhotoEvents {
  TAKE_PHOTO = 'npwd:TakePhoto',
  TAKE_PHOTO_SUCCESS = 'npwd:TakePhotoSuccess',
  TAKE_PHOTO_ERROR = 'npwd:TakePhotoError',
  UPLOAD_PHOTO = 'npwd:UploadPhoto',
  UPLOAD_PHOTO_SUCCESS = 'npwd:UploadPhotoSuccess',
  FETCH_PHOTOS = 'npwd:FetchPhotos',
  SEND_PHOTOS = 'npwd:SendPhotos',
  DELETE_PHOTO = 'npwd:deletePhoto',
  DELETE_PHOTO_SUCCESS = 'npwd:deletePhotoSuccess',
}
