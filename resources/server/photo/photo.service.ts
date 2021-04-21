import PlayerService from '../players/player.service';
import { GalleryPhoto, PhotoEvents } from '../../../typings/photo';
import PhotoDB, { _PhotoDB } from './photo.db';
import { photoLogger } from './photo.utils';

class _PhotoService {
  private readonly photoDB: _PhotoDB;

  constructor() {
    this.photoDB = PhotoDB;
    photoLogger.debug('Photo service started');
  }

  async handleUploadPhoto(src: number, image: string) {
    try {
      const identifier = PlayerService.getIdentifier(src);
      const photo = await this.photoDB.uploadPhoto(identifier, image);
      emitNet(PhotoEvents.UPLOAD_PHOTO_SUCCESS, src, photo);
    } catch (e) {
      photoLogger.error(`Failed to upload photo, ${e.message}`, {
        source: src,
      });
    }
  }

  async handleFetchPhotos(src: number) {
    try {
      const identifier = PlayerService.getIdentifier(src);
      const photos = await this.photoDB.getPhotosByIdentifier(identifier);
      emitNet(PhotoEvents.SEND_PHOTOS, src, photos);
    } catch (e) {
      photoLogger.error(`Failed to fetch photos, ${e.message}`, {
        source: src,
      });
    }
  }

  async handleDeletePhoto(src: number, photo: GalleryPhoto) {
    try {
      const identifier = PlayerService.getIdentifier(src);
      await this.photoDB.deletePhoto(photo, identifier);
      emitNet(PhotoEvents.DELETE_PHOTO_SUCCESS, src);
    } catch (e) {
      photoLogger.error(`Failed to fetch photos, ${e.message}`, {
        source: src,
      });
    }
  }
}

const PhotoService = new _PhotoService();

export default PhotoService;
