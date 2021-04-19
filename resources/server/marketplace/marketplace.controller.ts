import { MarketplaceEvents, MarketplaceListing } from '../../../typings/marketplace';
import { getSource } from '../utils/miscUtils';
import PlayerService from '../players/player.service';
import { reportListingToDiscord } from '../discord';
import { selloutLogger } from './marketplace.utils';
import MarketplaceService from './marketplace.service';

onNet(MarketplaceEvents.FETCH_LISTING, async () => {
  const src = getSource();
  MarketplaceService.handleFetchListings(src).catch((e) =>
    selloutLogger.error(`Error occurred in fetch listing event (${src}), Error: ${e.message}`),
  );
});

onNet(MarketplaceEvents.ADD_LISTING, async (listing: MarketplaceListing) => {
  const src = getSource();
  const Player = PlayerService.getPlayer(src);

  MarketplaceService.handleAddListing(
    src,
    Player.getFirstName(),
    Player.username,
    Player.getName(),
    Player.getPhoneNumber(),
    listing,
  ).catch((e) =>
    selloutLogger.error(`Error occurred in add listing event (${src}), Error: ${e.message}`),
  );
});

onNet(MarketplaceEvents.DELETE_LISTING, async (listingId: number) => {
  const src = getSource();
  MarketplaceService.handleDeleteListing(src, listingId).catch((e) =>
    selloutLogger.error(`Error occurred in delete listing event (${src}), Error: ${e.message}`),
  );
});

onNet(MarketplaceEvents.REPORT_LISTING, async (listing: MarketplaceListing) => {
  const src = getSource();
  MarketplaceService.handleReportListing(src, listing).catch((e) =>
    selloutLogger.error(`Error occurred in report listing event (${src}), Error: ${e.message}`),
  );
});
