import { pool } from './db';
import { getIdentifier, getSource } from './functions';
import { IPhoto, PhotoEvents } from '../../typings/photo';
import { mainLogger } from './sv_logger';

const photoLogger = mainLogger.child({ module: 'photo' });

async function uploadPhoto(identifier: string, image: string) {
  const query = 'INSERT INTO npwd_phone_gallery (identifier, image) VALUES (?, ?)';
  await pool.query(query, [identifier, image]);
}

async function getPhotosByIdentifier(identifier: string): Promise<IPhoto[]> {
  const query = 'SELECT id, image FROM npwd_phone_gallery WHERE identifier = ? ORDER BY id DESC';
  const [results] = await pool.query(query, [identifier]);
  return <IPhoto[]>results;
}

async function deletePhoto(photo: IPhoto, identifier: string) {
  const query = 'DELETE FROM npwd_phone_gallery WHERE image = ? AND identifier = ?';
  await pool.query(query, [photo.image, identifier]);
}

onNet(PhotoEvents.UPLOAD_PHOTO, async (image: string) => {
  const _source = getSource();
  try {
    const identifier = getIdentifier(_source);
    await uploadPhoto(identifier, image);
    emitNet(PhotoEvents.UPLOAD_PHOTO_SUCCESS, _source);
  } catch (e) {
    photoLogger.error(`Failed to upload photo, ${e.message}`, {
      source: _source,
    });
  }
});

onNet(PhotoEvents.FETCH_PHOTOS, async () => {
  const _source = getSource();
  try {
    const identifier = getIdentifier(_source);
    const photos = await getPhotosByIdentifier(identifier);
    emitNet(PhotoEvents.SEND_PHOTOS, _source, photos);
  } catch (e) {
    photoLogger.error(`Failed to fetch photos, ${e.message}`, {
      source: _source,
    });
  }
});

onNet(PhotoEvents.DELETE_PHOTO, async (photo: IPhoto) => {
  const _source = getSource();
  try {
    const identifier = getIdentifier(_source);
    await deletePhoto(photo, identifier);
    emitNet(PhotoEvents.DELETE_PHOTO_SUCCESS, _source);
  } catch (e) {
    photoLogger.error(`Failed to fetch photos, ${e.message}`, {
      source: _source,
    });
  }
});
