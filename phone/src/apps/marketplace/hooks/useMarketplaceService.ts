import { useNuiEvent } from 'fivem-nui-react-lib';
import { MarketplaceBroadcastAddDTO, MarketplaceEvents } from '@typings/marketplace';
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
    (listingIds: number[]) => {
      deleteListing(listingIds);
    },
    [deleteListing],
  );

  useNuiEvent<MarketplaceBroadcastAddDTO>(
    'MARKETPLACE',
    MarketplaceEvents.BROADCAST_ADD,
    addListingHandler,
  );

  useNuiEvent<number[]>('MARKETPLACE', MarketplaceEvents.BROADCAST_DELETE, deleteListingHandler);
};
