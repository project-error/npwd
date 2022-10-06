import { GalleryPhoto } from '../../../typings/photo';
import DbInterface from '../db/db_wrapper';

export class _PhotoDB {
  async uploadPhoto(identifier: string, image: string): Promise<GalleryPhoto> {
    const query = 'INSERT INTO npwd_phone_gallery (identifier, image) VALUES (?, ?)';
    const [results] = (await DbInterface._rawExec(query, [identifier, image])) as any;
    return { id: results.insertId, image };
  }

  async getPhotosByIdentifier(identifier: string): Promise<GalleryPhoto[]> {
    const query = 'SELECT id, image FROM npwd_phone_gallery WHERE identifier = ? ORDER BY id DESC';
    const [results] = await DbInterface._rawExec(query, [identifier]);
    return <GalleryPhoto[]>results;
  }

  async deletePhoto(photo: GalleryPhoto, identifier: string) {
    const query = 'DELETE FROM npwd_phone_gallery WHERE image = ? AND identifier = ?';
    await DbInterface._rawExec(query, [photo.image, identifier]);
  }

  async deletePhotoById(photo: number, identifier: string) {
    const query = 'DELETE FROM npwd_phone_gallery WHERE id = ? AND identifier = ?';
    await DbInterface._rawExec(query, [photo, identifier]);
  }
}

const PhotoDB = new _PhotoDB();

export default PhotoDB;
