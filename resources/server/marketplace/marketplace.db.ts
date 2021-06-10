import { pool } from '../db';
import { MarketplaceListing, MarketplaceListingBase } from '../../../typings/marketplace';
import { ResultSetHeader } from 'mysql2';

export class _MarketplaceDB {
  async addListing(
    identifier: string,
    username: string,
    name: string,
    number: string,
    listing: MarketplaceListingBase,
  ): Promise<number> {
    const query =
      'INSERT INTO npwd_marketplace_listings (identifier, username, name, number, title, url, description) VALUES (?, ?, ?, ?, ?, ?, ?)';

    const [result] = await pool.query(query, [
      identifier,
      username,
      name,
      number,
      listing.title,
      listing.url,
      listing.description,
    ]);

    const resultCast = result as ResultSetHeader;

    return resultCast.insertId;
  }

  async fetchListings(): Promise<MarketplaceListing[]> {
    const query = 'SELECT * FROM npwd_marketplace_listings ORDER BY id DESC';

    const [results] = await pool.query(query);
    return <MarketplaceListing[]>results;
  }

  async deleteListing(listingId: number, identifier: string): Promise<void> {
    const query = 'DELETE FROM npwd_marketplace_listings WHERE id = ? AND identifier = ?';

    await pool.query(query, [listingId, identifier]);
  }

  async getListing(listingId: number): Promise<MarketplaceListing> {
    const query = `SELECT * FROM npwd_marketplace_listings WHERE id = ?`;
    const [results] = await pool.query(query, [listingId]);
    const listings = <MarketplaceListing[]>results;
    return listings[0];
  }

  async reportListing(listingId: number, profile: string): Promise<void> {
    const query = `INSERT INTO npwd_marketplace_reports (listing_id, profile) VALUES (?, ?)`;
    await pool.query(query, [listingId, profile]);
  }

  async doesReportExist(listingId: number, profile: string): Promise<boolean> {
    const query = `SELECT * FROM npwd_marketplace_reports WHERE listing_id = ? AND profile = ?`;
    const [results] = await pool.query(query, [listingId, profile]);
    const result = <any>results;

    return result.length > 0;
  }
}

const MarketplaceDB = new _MarketplaceDB();

export default MarketplaceDB;
