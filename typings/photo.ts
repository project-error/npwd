export interface IPhoto {
  image: string;
  id: number;
}

export enum PhotoEvents {
  TAKE_PHOTO = 'npwd:TakePhoto',
  UPLOAD_PHOTO = 'npwd:UploadPhoto',
  UPLOAD_PHOTO_SUCCESS = 'npwd:UploadPhotoSuccess',
  FETCH_PHOTOS = 'npwd:FetchPhotos',
  SEND_PHOTOS = 'npwd:SendPhotos',
  DELETE_PHOTO = 'npwd:deletePhoto',
  DELETE_PHOTO_SUCCESS = 'npwd:deletePhotoSuccess',
}
