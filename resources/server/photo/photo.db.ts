import { GalleryPhoto } from '../../../typings/photo';
import { pool } from '../db';

export class _PhotoDB {
  async uploadPhoto(identifier: string, image: string): Promise<GalleryPhoto> {
    const query = 'INSERT INTO npwd_phone_gallery (identifier, image) VALUES (?, ?)';
    const [results] = (await pool.query(query, [identifier, image])) as any;
    return { id: results.insertId, image };
  }

  async getPhotosByIdentifier(identifier: string): Promise<GalleryPhoto[]> {
    const query = 'SELECT id, image FROM npwd_phone_gallery WHERE identifier = ? ORDER BY id DESC';
    const [results] = await pool.query(query, [identifier]);
    return <GalleryPhoto[]>results;
  }

  async deletePhoto(photo: GalleryPhoto, identifier: string) {
    const query = 'DELETE FROM npwd_phone_gallery WHERE image = ? AND identifier = ?';
    await pool.query(query, [photo.image, identifier]);
  }
}

const PhotoDB = new _PhotoDB();

export default PhotoDB;
