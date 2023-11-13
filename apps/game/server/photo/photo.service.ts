import PlayerService from '../players/player.service';
import { GalleryPhoto } from '@typings/photo';
import { PhotoDB, _PhotoDB } from './photo.database';
import { photoLogger } from './photo.utils';
import { PromiseEventResp, PromiseRequest } from '../lib/PromiseNetEvents/promise.types';
import { config } from '../config';
import { v4 as uuidv4 } from 'uuid';
import { FormData, fileFromSync } from 'node-fetch';
import * as fs from 'fs';
import { apiPhotoUpload, webhookPhotoUpload } from '../lib/http-service';

const exp = global.exports;
const path = GetResourcePath('npwd') + '/uploads';

class _PhotoService {
  private readonly photoDB: _PhotoDB;
  private readonly TOKEN: string;

  constructor() {
    this.photoDB = PhotoDB;
    this.TOKEN = GetConvar('SCREENSHOT_BASIC_TOKEN', '');
    photoLogger.debug('Photo service started');
  }

  async handleUploadPhoto(
    reqObj: PromiseRequest<void>,
    resp: PromiseEventResp<GalleryPhoto>,
  ): Promise<void> {
    try {
      exp['screenshot-basic'].requestClientScreenshot(
        reqObj.source,
        {
          encoding: config.images.imageEncoding,
          quality: 0.85,
        },
        async (err: string | boolean, data: string) => {
          if (!fs.existsSync(path)) fs.mkdirSync(path);

          let type: string;
          switch (config.images.imageEncoding) {
            case 'jpg':
              type = 'image/jpeg';
              break;
            case 'png':
              type = 'image/png';
              break;
            case 'webp':
              type = 'image/webp';
              break;
          }

          const filePath = `${path}/screenshot-${uuidv4()}.${config.images.imageEncoding}`;

          const _data = Buffer.from(data.replace(`data:${type};base64`, ''), 'base64');
          fs.writeFileSync(filePath, _data);

          let body: string | FormData = new FormData();
          const blob = fileFromSync(filePath, type);

          if (config.images.type === 'imgur') {
            body = data.replace(/^data:image\/[a-z]+;base64,/, '').trim();
          } else if (config.images.type === 'upload.io') {
            body = blob;
          } else {
            body.append(config.images.type, blob);
          }

          if (config.images.useWebhook) {
            try {
              const player = PlayerService.getPlayer(reqObj.source);
              const res = await webhookPhotoUpload(this.TOKEN, filePath, blob, player);

              const identifier = PlayerService.getIdentifier(reqObj.source);
              const photo = await this.photoDB.uploadPhoto(identifier, res);

              // File is uploaded, so its safe to remove
              fs.rmSync(filePath);

              return resp({ status: 'ok', data: photo });
            } catch (err) {
              photoLogger.error(`Failed to upload photo`, {
                source: reqObj.source,
              });
              return resp({ status: 'error', errorMsg: 'GENERIC_DB_ERROR' });
            }
          }

          let returnData;
          await apiPhotoUpload(body, this.TOKEN)
            .then((result) => {
              returnData = result;
            })
            .catch((err) => {
              photoLogger.error(
                `Failed to upload photo, status code: ${err.statusCode}: ${err.errorText}`,
                {
                  source: reqObj.source,
                },
              );
              resp({ status: 'error', errorMsg: 'GENERIC_DB_ERROR' });
            });

          fs.rmSync(filePath);
          if (!returnData) return; // Already caught

          for (const index of config.images.returnedDataIndexes) returnData = returnData[index];

          const identifier = PlayerService.getIdentifier(reqObj.source);
          const photo = await this.photoDB.uploadPhoto(identifier, returnData);

          resp({ status: 'ok', data: photo });
        },
      );
    } catch (e) {
      photoLogger.error(`Failed to upload photo, ${e.message}`, {
        source: reqObj.source,
      });
      resp({ status: 'error', errorMsg: 'GENERIC_DB_ERROR' });
    }
  }

  async handleFetchPhotos(reqObj: PromiseRequest<void>, resp: PromiseEventResp<GalleryPhoto[]>) {
    try {
      const identifier = PlayerService.getIdentifier(reqObj.source);
      const photos = await this.photoDB.getPhotosByIdentifier(identifier);

      resp({ status: 'ok', data: photos });
    } catch (e) {
      photoLogger.error(`Failed to fetch photos, ${e.message}`, {
        source: reqObj.source,
      });
      resp({ status: 'error', errorMsg: 'GENERIC_DB_ERROR' });
    }
  }

  async handleDeletePhoto(
    reqObj: PromiseRequest<GalleryPhoto>,
    resp: PromiseEventResp<void>,
  ): Promise<void> {
    try {
      const identifier = PlayerService.getIdentifier(reqObj.source);
      await this.photoDB.deletePhoto(reqObj.data, identifier);

      resp({ status: 'ok' });
    } catch (e) {
      photoLogger.error(`Failed to delete photo, ${e.message}`, {
        source: reqObj.source,
      });
      resp({ status: 'error', errorMsg: 'GENERIC_DB_ERROR' });
    }
  }

  async handleDeleteMultiplePhotos(
    reqObj: PromiseRequest<number[]>,
    resp: PromiseEventResp<void>,
  ): Promise<void> {
    const identifier = PlayerService.getIdentifier(reqObj.source);
    const photoIds = reqObj.data;
    try {
      for (const photo of photoIds) {
        await this.photoDB.deletePhotoById(photo, identifier);
      }
      resp({ status: 'ok' });
    } catch (e) {
      photoLogger.error(`Failed to delete photos, ${e.message}`, {
        source: reqObj.source,
      });
      resp({ status: 'error', errorMsg: 'GENERIC_DB_ERROR' });
    }
  }

  async handleSaveImage(
    reqObj: PromiseRequest<{ url: string }>,
    resp: PromiseEventResp<GalleryPhoto>,
  ): Promise<void> {
    try {
      const identifier = PlayerService.getIdentifier(reqObj.source);
      const photo = await this.photoDB.uploadPhoto(identifier, reqObj.data.url);

      resp({ status: 'ok', data: photo });
    } catch (e) {
      photoLogger.error(`Failed to upload photo, ${e.message}`, {
        source: reqObj.source,
      });
      resp({ status: 'error', errorMsg: 'GENERIC_DB_ERROR' });
    }
  }
}

const PhotoService = new _PhotoService();

export default PhotoService;
