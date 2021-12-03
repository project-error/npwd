import PlayerService from '../players/player.service';
import { marketplaceLogger } from './marketplace.utils';
import MarketplaceDB, { _MarketplaceDB } from './marketplace.db';
import {
  ListingTypeResp,
  MarketplaceDeleteDTO,
  MarketplaceEvents,
  MarketplaceListing,
  MarketplaceListingBase,
  MarketplaceReportDTO,
} from '../../../typings/marketplace';
import { reportListingToDiscord } from '../misc/discord';
import { PromiseEventResp, PromiseRequest } from '../lib/PromiseNetEvents/promise.types';

class _MarketplaceService {
  private readonly marketplaceDB: _MarketplaceDB;

  constructor() {
    this.marketplaceDB = MarketplaceDB;
    marketplaceLogger.debug('Marketplace service started');
  }

  async handleAddListing(
    reqObj: PromiseRequest<MarketplaceListingBase>,
    resp: PromiseEventResp<ListingTypeResp>,
  ): Promise<void> {
    marketplaceLogger.debug('Handling add listing, listing:');
    marketplaceLogger.debug(reqObj.data);

    const player = PlayerService.getPlayer(reqObj.source);

    try {
      const doesListingExist = await this.marketplaceDB.doesListingExist(reqObj.data);
      if (doesListingExist) return resp({ status: 'error', data: ListingTypeResp.DUPLICATE });

      const listingId = await this.marketplaceDB.addListing(
        player.getIdentifier(),
        player.username,
        player.getName(),
        player.getPhoneNumber(),
        reqObj.data,
      );
      // Respond with success to original source
      resp({ status: 'ok' });

      const returnObj: MarketplaceListing = {
        id: listingId,
        identifier: player.getIdentifier(),
        name: player.getName(),
        number: player.getPhoneNumber(),
        url: reqObj.data.url,
        username: player.username,
        description: reqObj.data.description,
        title: reqObj.data.title,
      };
      // Broadcast to everyone we are adding a listing
      emitNet(MarketplaceEvents.BROADCAST_ADD, -1, { type: 'ADD', listing: returnObj });
    } catch (e) {
      marketplaceLogger.error(`Failed to add listing ${e.message}`, {
        source: reqObj.source,
      });

      resp({ status: 'error', errorMsg: 'DB_ERROR' });
    }
  }

  async handleFetchListings(
    req: PromiseRequest<void>,
    resp: PromiseEventResp<MarketplaceListing[]>,
  ) {
    try {
      const listings = await this.marketplaceDB.fetchListings();

      resp({ data: listings, status: 'ok' });
    } catch (e) {
      marketplaceLogger.error(`Failed to fetch listings, ${e.message}`, {
        source: req.source,
      });
      resp({ status: 'error', errorMsg: 'DB_ERROR' });
    }
  }

  async handleDeleteListing(
    reqObj: PromiseRequest<MarketplaceDeleteDTO>,
    resp: PromiseEventResp<void>,
  ): Promise<void> {
    const identifier = PlayerService.getIdentifier(reqObj.source);
    try {
      await this.marketplaceDB.deleteListing(reqObj.data.id, identifier);

      resp({ status: 'ok' });

      const returnObj: MarketplaceDeleteDTO = {
        id: reqObj.data.id,
      };

      emitNet(MarketplaceEvents.BROADCAST_DELETE, -1, returnObj);
    } catch (e) {
      marketplaceLogger.error(`Error in handleDeleteListing, ${e.message}`);

      resp({ status: 'error', errorMsg: 'DB_ERROR' });
    }
  }

  async handleDeleteListingsOnDrop(identifier: string) {
    try {
      await this.marketplaceDB.deleteListingsOnDrop(identifier);
    } catch (e) {
      marketplaceLogger.error(`Error when deleting listings on player drop, ${e.message}`);
    }
  }

  async handleReportListing(
    reqObj: PromiseRequest<MarketplaceReportDTO>,
    resp: PromiseEventResp<void>,
  ): Promise<void> {
    try {
      const rListing = await this.marketplaceDB.getListing(reqObj.data.id);
      const reportExists = await this.marketplaceDB.doesReportExist(
        reqObj.data.id,
        rListing.name || rListing.username,
      );

      const reportingPlayer = GetPlayerName(reqObj.source.toString());

      if (reportExists) {
        marketplaceLogger.error(`This listing has already been reported`);
        resp({ status: 'error', errorMsg: 'REPORT_EXISTS' });
      }

      await this.marketplaceDB.reportListing(rListing.id, rListing.name || rListing.username);
      await reportListingToDiscord(rListing, reportingPlayer);
    } catch (e) {
      marketplaceLogger.error(`Failed to report listing ${e.message}`, {
        source: reqObj.source,
      });
      resp({ status: 'error', errorMsg: 'DB_ERROR' });
    }
  }
}

const MarketplaceService = new _MarketplaceService();
export default MarketplaceService;
