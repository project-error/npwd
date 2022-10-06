import { GalleryPhoto, GalleryResponse } from '../../../typings/photo';
import DbInterface from '../db/db_wrapper';

const PHOTOS_PER_PAGE = 12;

export class _PhotoDB {
  async uploadPhoto(identifier: string, image: string): Promise<GalleryPhoto> {
    const query = 'INSERT INTO npwd_phone_gallery (identifier, image) VALUES (?, ?)';
    const [results] = (await DbInterface._rawExec(query, [identifier, image])) as any;
    return { id: results.insertId, image };
  }

  async getPhotoCount(identifier: string): Promise<number> {
    const countQuery =
      'SELECT COUNT(*) as count FROM npwd_phone_gallery WHERE identifier = ? LIMIT 1';
    const [countResults] = await DbInterface._rawExec(countQuery, [identifier]);

    const countList = <any[]>countResults;
    return countList[0].count;
  }

  async getPhotosPageByIdentifier(page: number, identifier: string): Promise<GalleryResponse> {
    console.log('CURRENT PAGE', page);

    // page 1 = offset 1
    // page 2 = offset 12
    const offset = page === 1 ? 1 : (page - 1) * PHOTOS_PER_PAGE;
    console.log('OFFSET', offset);

    const query =
      'SELECT id, image FROM npwd_phone_gallery WHERE identifier = ? ORDER BY id DESC LIMIT ? OFFSET ?';
    const [results] = await DbInterface._rawExec(query, [
      identifier,
      PHOTOS_PER_PAGE.toString(),
      offset.toString(),
    ]);

    const images = <GalleryPhoto[]>results;
    const count = await this.getPhotoCount(identifier);

    console.log('initial images len', images.length);

    return {
      images,
      count,
    };
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
