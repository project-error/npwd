import PlayerService from '../players/player.service';
import { selloutLogger } from './marketplace.utils';
import MarketplaceDB, { _MarketplaceDB } from './marketplace.db';
import {
  MarketplaceDeleteDTO,
  MarketplaceEvents,
  MarketplaceListing,
  MarketplaceListingBase,
  MarketplaceReportDTO,
} from '../../../typings/marketplace';
import { notesLogger } from '../notes/notes.utils';
import { reportListingToDiscord } from '../discord';
import { PromiseEventReturnFunc, PromiseRequest } from '../utils/PromiseNetEvents/promise.types';

interface HandleAddListingObj {
  src: number;
  identifier: string;
  username: string;
  name: string;
  number: any;
  listing: MarketplaceListingBase;
}

class _MarketplaceService {
  private readonly marketplaceDB: _MarketplaceDB;

  constructor() {
    this.marketplaceDB = MarketplaceDB;
    selloutLogger.debug('Marketplace service started');
  }

  async handleAddListing(
    { listing, src, identifier, number, name, username }: HandleAddListingObj,
    resp: PromiseEventReturnFunc,
  ): Promise<void> {
    selloutLogger.debug('Handling add listing, listing:');
    selloutLogger.debug(listing);

    try {
      const listingId = await this.marketplaceDB.addListing(
        identifier,
        username,
        name,
        number,
        listing,
      );
      // Respond with success to original source
      resp({ status: 'ok' });

      const returnObj: MarketplaceListing = {
        id: listingId,
        identifier,
        name,
        number,
        url: listing.url,
        username,
        description: listing.description,
        title: listing.title,
      };
      // Broadcast to everyone we are adding a listing
      emitNet(MarketplaceEvents.BROADCAST_EVENT, -1, { type: 'ADD', listing: returnObj });
    } catch (e) {
      selloutLogger.error(`Failed to add listing ${e.message}`, {
        source: src,
      });

      resp({ err: true, errMsg: 'Failed to create listing' });
    }
  }

  async handleFetchListings(resp: PromiseEventReturnFunc, src: number) {
    try {
      const listings = await this.marketplaceDB.fetchListings();

      resp({ data: listings, status: 'ok' });
    } catch (e) {
      selloutLogger.error(`Failed to fetch listings, ${e.message}`, {
        source: src,
      });
      resp({ err: true, errMsg: 'Failed to fetch listings' });
    }
  }

  async handleDeleteListing(
    reqObj: PromiseRequest<MarketplaceDeleteDTO>,
    resp: PromiseEventReturnFunc,
  ): Promise<void> {
    const identifier = PlayerService.getIdentifier(reqObj.source);
    try {
      await this.marketplaceDB.deleteListing(reqObj.data.id, identifier);

      resp({ status: 'ok' });

      const returnObj: MarketplaceDeleteDTO = {
        id: reqObj.data.id,
      };

      emitNet(MarketplaceEvents.BROADCAST_EVENT, -1, { type: 'DELETE', listing: returnObj });
    } catch (e) {
      notesLogger.error(`Error in handleDeleteListing, ${e.message}`);

      resp({ error: true, errMsg: 'Error in deleting listing' });
    }
  }

  async handleReportListing(
    reqObj: PromiseRequest<MarketplaceReportDTO>,
    resp: PromiseEventReturnFunc,
  ): Promise<void> {
    try {
      const rListing = await this.marketplaceDB.getListing(reqObj.data.id);
      const reportExists = await this.marketplaceDB.doesReportExist(
        reqObj.data.id,
        rListing.number,
      );

      const reportingPlayer = GetPlayerName(reqObj.source.toString());

      if (reportExists) {
        selloutLogger.error(`This listing has already been reported`);
        resp({ error: true, errorMsg: 'Listing already exists' });
      }

      await this.marketplaceDB.reportListing(rListing.id, rListing.name);
      await reportListingToDiscord(rListing, reportingPlayer);
    } catch (e) {
      selloutLogger.error(`Failed to report listing ${e.message}`, {
        source: reqObj.source,
      });
      resp({ error: true, errorMsg: 'Failed to report listing' });
    }
  }
}

const MarketplaceService = new _MarketplaceService();
export default MarketplaceService;
