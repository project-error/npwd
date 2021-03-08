import events from '../utils/events';
import { getIdentifier, getPlayer, getSource } from './functions';
import { pool } from './db';
import { mainLogger } from './sv_logger';
import { MarketplaceListing } from '../../phone/src/common/typings/marketplace';
import { reportListingToDiscord } from './discord';

const selloutLogger = mainLogger.child({ module: 'sellout' });

async function fetchAllListings(): Promise<MarketplaceListing[]> {
  const query = 'SELECT * FROM npwd_sellout_listings ORDER BY id DESC';

  const [results] = await pool.query(query);
  const listings = <MarketplaceListing[]>results;

  return listings;
}

async function addListing(
  identifier: string,
  username: string,
  name: string,
  number: any,
  listing: MarketplaceListing,
): Promise<void> {
  const query =
    'INSERT INTO npwd_sellout_listings (identifier, username, name, number, title, url, description) VALUES (?, ?, ?, ?, ?, ?, ?)';
  await pool.query(query, [
    identifier,
    username,
    name,
    number,
    listing.title,
    listing.url,
    listing.description,
  ]);
}

async function deleteListing(listingId: number, identifier: string): Promise<void> {
  const query = 'DELETE FROM npwd_sellout_listings WHERE id = ? AND identifier = ?';

  await pool.query(query, [listingId, identifier]);
}

async function getListing(listingId: number): Promise<MarketplaceListing> {
  const query = `SELECT * FROM npwd_sellout_listings WHERE id = ?`;
  const [results] = await pool.query(query, [listingId]);
  const listings = <MarketplaceListing[]>results;
  const listing = listings[0];

  return listing;
}

async function reportListing(listingId: number, profile: string): Promise<void> {
  const query = `INSERT INTO npwd_marketplace_reports (listing_id, profile) VALUES (?, ?)`;

  await pool.query(query, [listingId, profile]);
}

async function doesReportExist(listingId: number, profile: string): Promise<boolean> {
  const query = `SELECT * FROM npwd_marketplace_reports WHERE listing_id = ? AND profile = ?`;
  const results = await pool.query(query, [listingId, profile]);
  const result = <any[]>results;

  return result.length > 0;
}

onNet(events.SELLOUT_FETCH_LISTING, async () => {
  const _source = getSource();
  try {
    const listings = await fetchAllListings();
    emitNet(events.SELLOUT_SEND_LISTING, _source, listings);
  } catch (e) {
    selloutLogger.error(`Failed to fetch listings, ${e.message}`, {
      source: _source,
    });
  }
});

onNet(events.SELLOUT_ADD_LISTING, async (listing: MarketplaceListing) => {
  const _source = getSource();
  try {
    const player = getPlayer(_source);

    // This is used as username for the reports
    const username = GetPlayerName(_source);

    await addListing(
      player.identifier,
      username,
      `${player.firstname} ${player.lastname}`,
      player.phoneNumber,
      listing,
    );

    emitNet(events.SELLOUT_ADD_LISTING_SUCCESS, _source);
    emitNet(events.SELLOUT_ACTION_RESULT, _source, {
      message: 'MARKETPLACE_CREATE_LISTING_SUCCESS',
      type: 'success',
    });
  } catch (e) {
    selloutLogger.error(`Failed to add listing ${e.message}`, {
      source: _source,
    });

    emitNet(events.SELLOUT_ACTION_RESULT, _source, {
      message: 'MARKETPALCE_CREATE_LISTING_FAILED',
      type: 'error',
    });
  }
});

onNet(events.SELLOUT_DELETE_LISTING, async (listingId: number) => {
  const pSource = getSource();
  try {
    const identifier = getIdentifier(pSource);

    await deleteListing(listingId, identifier);

    // fetches the listings again
    emitNet(events.SELLOUT_DELETE_LISTING_SUCCESS, pSource);

    emitNet(events.SELLOUT_ACTION_RESULT, pSource, {
      message: 'MARKETPLACE_DELETE_LISTING_SUCCESS',
      type: 'success',
    });
  } catch (e) {
    selloutLogger.error(`Failed to delete listing ${e.message}`, {
      source: pSource,
    });
    emitNet(events.SELLOUT_ACTION_RESULT, pSource, {
      message: 'MARKETPLACE_DELETE_LISTING_FAILED',
      type: 'error',
    });
  }
});

onNet(events.SELLOUT_REPORT_LISTING, async (listing: MarketplaceListing) => {
  const pSource = getSource();

  try {
    const rListing = await getListing(listing.id);
    const reportExists = await doesReportExist(listing.id, listing.name);

    // gets the player name (steam) of the player that is reporting
    const reportingPlayer = GetPlayerName(pSource);

    if (reportExists) {
      // send an info alert
      selloutLogger.error(`This listing has already been reported`);

      emitNet(events.SELLOUT_ACTION_RESULT, pSource, {
        message: 'MARKETPLACE_REPORT_LISTING_FAILED',
        type: 'info',
      });
    } else {
      await reportListing(rListing.id, rListing.name);
      await reportListingToDiscord(rListing, reportingPlayer);

      emitNet(events.SELLOUT_ACTION_RESULT, pSource, {
        message: 'MARKETPLACE_REPORT_LISTING_SUCCESS',
        type: 'success',
      });
    }
  } catch (e) {
    selloutLogger.error(`Failed to report listing ${e.message}`, {
      source: pSource,
    });
  }
});
