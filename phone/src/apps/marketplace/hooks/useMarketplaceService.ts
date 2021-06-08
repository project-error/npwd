import { useNuiEvent } from 'fivem-nui-react-lib';
import {
  MarketplaceBroadcastAddDTO,
  MarketplaceDeleteDTO,
  MarketplaceEvents,
} from '../../../../../typings/marketplace';
import { useMarketplaceActions } from './useMarketplaceActions';

export const useMarketplaceService = () => {
  const { addListing, deleteListing } = useMarketplaceActions();

  const addListingHandler = (resp: MarketplaceBroadcastAddDTO) => {
    addListing(resp.listing);
  };

  const deleteListingHandler = (listing: MarketplaceDeleteDTO) => {
    deleteListing(listing.id);
  };

  useNuiEvent<MarketplaceBroadcastAddDTO>(
    'MARKETPLACE',
    MarketplaceEvents.BROADCAST_ADD,
    addListingHandler,
  );

  useNuiEvent<MarketplaceDeleteDTO>(
    'MARKETPLACE',
    MarketplaceEvents.BROADCAST_DELETE,
    deleteListingHandler,
  );
};
