import PlayerService from '../players/player.service';
import { selloutLogger } from './marketplace.utils';
import MarketplaceDB, { _MarketplaceDB } from './marketplace.db';
import { MarketplaceEvents, MarketplaceListing } from '../../../typings/marketplace';
import { notesLogger } from '../notes/notes.utils';
import { listenerCount } from 'cluster';
import { reportListingToDiscord } from '../discord';

class _MarketplaceService {
  private readonly marketplaceDB: _MarketplaceDB;

  constructor() {
    this.marketplaceDB = MarketplaceDB;
    selloutLogger.debug('Marketplace service started');
  }

  async handleAddListing(
    src: number,
    identifier: string,
    username: string,
    name: string,
    number: any,
    listing: MarketplaceListing,
  ): Promise<void> {
    selloutLogger.debug('Handling add listing, listing:');
    selloutLogger.debug;

    try {
      await this.marketplaceDB.addListing(identifier, username, name, number, listing);

      emitNet(MarketplaceEvents.ADD_LISTING_SUCCESS, src);
      emitNet(MarketplaceEvents.ACTION_RESULT, src, {
        message: 'MARKETPLACE_CREATE_LISTING_SUCCESS',
        type: 'success',
      });
    } catch (e) {
      selloutLogger.error(`Failed to add listing ${e.message}`, {
        source: src,
      });

      emitNet(MarketplaceEvents.ACTION_RESULT, src, {
        message: 'MARKETPLACE_CREATE_LISTING_FAILED',
        type: 'error',
      });
    }
  }

  async handleFetchListings(src: number) {
    try {
      const listings = await this.marketplaceDB.fetchListings();

      emitNet(MarketplaceEvents.SEND_LISTING, src, listings);
    } catch (e) {
      selloutLogger.error(`Failed to fetch listings, ${e.message}`, {
        source: src,
      });
    }
  }

  async handleDeleteListing(src: number, listingId: number): Promise<void> {
    const identifier = PlayerService.getIdentifier(src);
    try {
      await this.marketplaceDB.deleteListing(listingId, identifier);

      emitNet(MarketplaceEvents.DELETE_LISTING_SUCCESS, src);
      emitNet(MarketplaceEvents.ACTION_RESULT, src, {
        message: 'MARKETPLACE_DELETE_LISTING_SUCCESS',
        type: 'success',
      });
    } catch (e) {
      notesLogger.error(`Error in handleDeleteListing, ${e.message}`);

      emitNet(MarketplaceEvents.ACTION_RESULT, src, {
        message: 'MARKETPLACE_DELETE_LISTING_FAILED',
        type: 'error',
      });
    }
  }

  async handleReportListing(src: number, listing: MarketplaceListing): Promise<void> {
    try {
      const rListing = await this.marketplaceDB.getListing(listing.id);
      const reportExists = await this.marketplaceDB.doesReportExist(listing.id, listing.name);

      const reportingPlayer = GetPlayerName(src.toString());
      if (reportExists) {
        selloutLogger.error(`This listing has already been reported`);
        return emitNet(MarketplaceEvents.ACTION_RESULT, src, {
          message: 'MARKETPLACE_REPORT_LISTING_FAILED',
          type: 'info',
        });
      }

      await this.marketplaceDB.reportListing(rListing.id, rListing.name);
      await reportListingToDiscord(rListing, reportingPlayer);

      emitNet(MarketplaceEvents.ACTION_RESULT, src, {
        message: 'MARKETPLACE_REPORT_LISTING_SUCCESS',
        type: 'success',
      });
    } catch (e) {
      selloutLogger.error(`Failed to report listing ${e.message}`, {
        source: src,
      });
    }
  }
}

const MarketplaceService = new _MarketplaceService();
export default MarketplaceService;
