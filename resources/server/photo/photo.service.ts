import PlayerService from '../players/player.service';
import { FetchPhotosRequest, GalleryPhoto } from '../../../typings/photo';
import PhotoDB, { _PhotoDB } from './photo.db';
import { photoLogger } from './photo.utils';
import { PromiseEventResp, PromiseRequest } from '../lib/PromiseNetEvents/promise.types';
import { config } from '../config';
import { v4 as uuidv4 } from 'uuid';
import fetch, { FormData, fileFromSync } from 'node-fetch';
import * as fs from 'fs';

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

          const filePath = `${path}/screentshot-${uuidv4()}.${config.images.imageEncoding}`;

          const _data = Buffer.from(data.replace(`data:${type};base64`, ''), 'base64');
          fs.writeFileSync(filePath, _data);

          let body: string | FormData = new FormData();
          const blob = fileFromSync(filePath, type);

          if (config.images.type === 'imgur') {
            body = data.replace(/^data:image\/[a-z]+;base64,/, '').trim();
          } else {
            body.append(config.images.type, blob);
          }

          let returnData = await fetch(config.images.url, {
            method: 'POST',
            body,
            headers: {
              [config.images.useAuthorization &&
              config.images
                .authorizationHeader]: `${config.images.authorizationPrefix} ${this.TOKEN}`,
              [config.images.useContentType && 'Content-Type']: config.images.contentType,
            },
          }).then(async (result) => {
            if (result.status !== 200) {
              const err = await result.text();
              photoLogger.error(`Failed to upload photo, status code: ${result.status}: ${err}`, {
                source: reqObj.source,
              });
              resp({ status: 'error', errorMsg: 'GENERIC_DB_ERROR' });
            }

            return (await result.json()) as any;
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

  async handleFetchPhotos(
    reqObj: PromiseRequest<FetchPhotosRequest>,
    resp: PromiseEventResp<GalleryPhoto[]>,
  ) {
    try {
      const identifier = PlayerService.getIdentifier(reqObj.source);
      const photos = await this.photoDB.getPhotosPageByIdentifier(reqObj.data.page, identifier);

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
