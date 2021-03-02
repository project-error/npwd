import events from '../utils/events';
import { ESX } from './server';
import { getSource } from './functions';
import { pool } from './db';
import { usePhoneNumber } from './functions';
import { mainLogger } from './sv_logger';
import { MarketplaceListing } from '../../phone/src/common/typings/marketplace';

const selloutLogger = mainLogger.child({ module: 'sellout' });


async function fetchAllListings(): Promise<MarketplaceListing[]> {
  const query = 'SELECT * FROM npwd_sellout_listings ORDER BY id DESC';

  const [results] = await pool.query(query);
  const listings = <MarketplaceListing[]>results;

  return listings;
}

async function addListing(
  identifier: string,
  name: string,
  number: any,
  listing: MarketplaceListing
): Promise<void> {
  const query =
    'INSERT INTO npwd_sellout_listings (identifier, name, number, title, url, description) VALUES (?, ?, ?, ?, ?, ?)';
  await pool.query(query, [
    identifier,
    name,
    number,
    listing.title,
    listing.url,
    listing.description,
  ]);
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
    const xPlayer = ESX.GetPlayerFromId(_source);
    const _identifier = xPlayer.getIdentifier();
    const name = xPlayer.getName();

    const phoneNumber = await usePhoneNumber(_identifier);
    await addListing(_identifier, name, phoneNumber, listing);

    emitNet(events.SELLOUT_ACTION_RESULT, _source, {
      message: 'MARKETPLACE_CREATE_LISTING_SUCCESS',
      type: 'success'
    })
  } catch (e) {
    selloutLogger.error(`Failed to add listing ${e.message}`, {
      source: _source,
    });
    
    emitNet(events.SELLOUT_ACTION_RESULT, _source, {
      message: 'MARKETPALCE_CREATE_LISTING_FAILED',
      type: 'error'
    })
  }
});
