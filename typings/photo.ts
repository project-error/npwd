export interface GalleryPhoto {
  image: string;
  id: number;
}

export enum PhotoEvents {
  TAKE_PHOTO = 'npwd:TakePhoto',
  TAKE_PHOTO_SUCCESS = 'npwd:TakePhotoSuccess',
  UPLOAD_PHOTO = 'npwd:UploadPhoto',
  FETCH_PHOTOS = 'npwd:FetchPhotos',
  DELETE_PHOTO = 'npwd:deletePhoto',
}
