import { useNuiEvent } from 'fivem-nui-react-lib';
import {
  MarketplaceBroadcastAddDTO,
  MarketplaceDeleteDTO,
  MarketplaceEvents,
} from '../../../../../typings/marketplace';
import { useMarketplaceActions } from './useMarketplaceActions';
import { useCallback } from 'react';

export const useMarketplaceService = () => {
  const { addListing, deleteListing } = useMarketplaceActions();

  const addListingHandler = useCallback(
    (resp: MarketplaceBroadcastAddDTO) => {
      addListing(resp.listing);
    },
    [addListing],
  );

  const deleteListingHandler = useCallback(
    (listing: MarketplaceDeleteDTO) => {
      deleteListing(listing.id);
    },
    [deleteListing],
  );

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
