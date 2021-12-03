import { MarketplaceListing, MarketplaceListingBase } from '../../../typings/marketplace';
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

    const insertId = await DbInterface.insert(query, [
      identifier,
      username,
      name,
      number,
      listing.title,
      listing.url,
      listing.description,
    ]);

    return insertId;
  }

  async fetchListings(): Promise<MarketplaceListing[]> {
    const query = 'SELECT * FROM npwd_marketplace_listings ORDER BY id DESC';

    const results = await DbInterface.fetch(query);
    return <MarketplaceListing[]>results;
  }

  async deleteListing(listingId: number, identifier: string): Promise<void> {
    const query = 'DELETE FROM npwd_marketplace_listings WHERE id = ? AND identifier = ?';

    await DbInterface.exec(query, [listingId, identifier]);
  }

  async deleteListingsOnDrop(identifier: string) {
    const query = `DELETE FROM npwd_marketplace_listings WHERE identifier = ?`;
    await DbInterface.exec(query, [identifier]);
  }

  async getListing(listingId: number): Promise<MarketplaceListing> {
    const query = `SELECT * FROM npwd_marketplace_listings WHERE id = ?`;
    const results = await DbInterface.fetch(query, [listingId]);
    const listings = <MarketplaceListing[]>results;
    return listings[0];
  }

  async reportListing(listingId: number, profile: string): Promise<void> {
    const query = `INSERT INTO npwd_marketplace_reports (listing_id, profile) VALUES (?, ?)`;
    await DbInterface.insert(query, [listingId, profile]);
  }

  async doesReportExist(listingId: number, profile: string): Promise<boolean> {
    const query = `SELECT * FROM npwd_marketplace_reports WHERE listing_id = ? AND profile = ?`;
    const results = await DbInterface.fetch(query, [listingId, profile]);
    const result = <any>results;

    return result.length > 0;
  }
}

const MarketplaceDB = new _MarketplaceDB();

export default MarketplaceDB;
