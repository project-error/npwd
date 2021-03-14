export interface IPhoto {
  image: string;
  id: number;
}

export enum PhotoEvents {
  TAKE_PHOTO = 'phone:TakePhoto',
  UPLOAD_PHOTO = 'phone:UploadPhoto',
  UPLOAD_PHOTO_SUCCESS = 'phone:UploadPhotoSuccess',
  FETCH_PHOTOS = 'phone:FetchPhotos',
  SEND_PHOTOS = 'phone:SendPhotos',
  DELETE_PHOTO = 'photo:deletePhoto',
  DELETE_PHOTO_SUCCESS = 'phone:deletePhotoSuccess',
}
