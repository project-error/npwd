import {
  MarketplaceEvents,
  MarketplaceListingBase,
  MarketplaceReportDTO,
} from '../../../typings/marketplace';
import PlayerService from '../players/player.service';
import { selloutLogger } from './marketplace.utils';
import MarketplaceService from './marketplace.service';
import { onNetPromise } from '../utils/PromiseNetEvents/onNetPromise';
import { MarketplaceDeleteDTO } from '../../../typings/marketplace';

onNetPromise(MarketplaceEvents.FETCH_LISTING, async (reqObj, resp) => {
  MarketplaceService.handleFetchListings(resp, reqObj.source).catch((e) => {
    selloutLogger.error(
      `Error occurred in fetch listing event (${reqObj.source}), Error: ${e.message}`,
    );
    resp({ error: true, errorMsg: '`Error occurred in fetch listing event' });
  });
});

onNetPromise<MarketplaceListingBase>(MarketplaceEvents.ADD_LISTING, async (reqObj, resp) => {
  const player = PlayerService.getPlayer(reqObj.source);
  MarketplaceService.handleAddListing(
    {
      src: reqObj.source,
      name: player.getName(),
      username: player.username,
      number: player.getPhoneNumber(),
      listing: reqObj.data,
      identifier: player.getIdentifier(),
    },
    resp,
  ).catch((e) => {
    selloutLogger.error(
      `Error occurred in add listing event (${reqObj.source}), Error: ${e.message}`,
    );
    resp({ error: true, errorMsg: 'Error occurred in add listing event' });
  });
});

onNetPromise<MarketplaceDeleteDTO>(MarketplaceEvents.DELETE_LISTING, async (reqObj, resp) => {
  // TODO: Needs a permission check of some sort here eventually
  MarketplaceService.handleDeleteListing(reqObj, resp).catch((e) => {
    selloutLogger.error(
      `Error occurred in delete listing event (${reqObj.source}), Error: ${e.message}`,
    );
    resp({ error: true, errorMsg: 'Error occurred in delete listing event' });
  });
});

onNetPromise<MarketplaceReportDTO>(MarketplaceEvents.REPORT_LISTING, async (reqObj, resp) => {
  // TODO: Needs a permission check of some sort here eventually
  MarketplaceService.handleReportListing(reqObj, resp).catch((e) => {
    selloutLogger.error(
      `Error occurred in report listing event (${reqObj.source}), Error: ${e.message}`,
    );
    resp({ error: true, errorMsg: 'Error occured in report listing event' });
  });
});
