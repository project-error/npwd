import { useNuiEvent } from 'fivem-nui-react-lib';
import { MarketplaceBroadcastAddDTO, MarketplaceEvents } from '@typings/marketplace';
import { useMarketplaceActions } from './useMarketplaceActions';
import { useCallback } from 'react';
import { useMarketplaceNotifications } from './useMarketplaceNotifications';

export const useMarketplaceService = () => {
  const { addListing, deleteListing, updateListing } = useMarketplaceActions();
  const { setNotification } = useMarketplaceNotifications();

  const addListingHandler = useCallback(
    (resp: MarketplaceBroadcastAddDTO) => {
      addListing(resp.listing);
      setNotification(resp.listing);
    },
    [addListing, setNotification],
  );

  const deleteListingHandler = useCallback(
    (listingIds: number[]) => {
      deleteListing(listingIds);
    },
    [deleteListing],
  );

  const updateListingHandler = useCallback(
    (resp: MarketplaceBroadcastAddDTO) => {
      updateListing(resp.listing);
    },
    [updateListing],
  );

  useNuiEvent<MarketplaceBroadcastAddDTO>(
    'MARKETPLACE',
    MarketplaceEvents.BROADCAST_ADD,
    addListingHandler,
  );

  useNuiEvent<MarketplaceBroadcastAddDTO>(
    'MARKETPLACE',
    MarketplaceEvents.BROADCAST_EDIT,
    updateListingHandler,
  );

  useNuiEvent<number[]>('MARKETPLACE', MarketplaceEvents.BROADCAST_DELETE, deleteListingHandler);
};
