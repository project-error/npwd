import {
  MarketplaceDeleteDTO,
  MarketplaceListing,
  MarketplaceListingBase,
  ReportListingDTO,
} from '@typings/marketplace';
import { ResultSetHeader } from 'mysql2';
import DbInterface from '../db/db_wrapper';

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

    const [result] = await DbInterface._rawExec(query, [
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
    const query = 'SELECT * FROM npwd_marketplace_listings WHERE reported = 0 ORDER BY id DESC';

    const [results] = await DbInterface._rawExec(query);
    return <MarketplaceListing[]>results;
  }

  async deleteListing(listingId: number, identifier: string): Promise<void> {
    const query = 'DELETE FROM npwd_marketplace_listings WHERE id = ? AND identifier = ?';

    await DbInterface._rawExec(query, [listingId, identifier]);
  }

  async deleteListingsOnDrop(identifier: string) {
    const query = `DELETE FROM npwd_marketplace_listings WHERE identifier = ? AND reported = 0`;
    await DbInterface._rawExec(query, [identifier]);
  }

  async getListing(listingId: number): Promise<MarketplaceListing> {
    const query = `SELECT * FROM npwd_marketplace_listings WHERE id = ?`;
    const [results] = await DbInterface._rawExec(query, [listingId]);
    const listings = <MarketplaceListing[]>results;
    return listings[0];
  }

  async getListingIdsByIdentifier(identifier: string): Promise<MarketplaceDeleteDTO[]> {
    const query = `SELECT id FROM npwd_marketplace_listings WHERE identifier = ?`;
    const [results] = await DbInterface._rawExec(query, [identifier]);

    return <MarketplaceDeleteDTO[]>results;
  }

  async reportListing(listing: ReportListingDTO): Promise<void> {
    const query = `UPDATE npwd_marketplace_listings SET reported = 1 WHERE id = ?`;
    await DbInterface._rawExec(query, [listing.id]);
  }

  async doesListingExist(listing: MarketplaceListingBase, identifier: string): Promise<boolean> {
    const query = `SELECT * FROM npwd_marketplace_listings WHERE title = ? AND identifier = ?`;
    const [results] = await DbInterface._rawExec(query, [listing.title, identifier]);
    const listings = <MarketplaceListingBase[]>results;

    return listings.length > 0;
  }

  async doesReportExist(listingId: number, profile: string): Promise<boolean> {
    const query = `SELECT * FROM npwd_marketplace_listings WHERE id = ? AND username = ? AND reported = 1`;
    const [results] = await DbInterface._rawExec(query, [listingId, profile]);
    const result = <any>results;

    return result.length > 0;
  }
}

export const MarketplaceDB = new _MarketplaceDB();
