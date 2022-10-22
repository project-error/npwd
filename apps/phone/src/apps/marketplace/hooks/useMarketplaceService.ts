import { useNuiEvent } from 'fivem-nui-react-lib';
import { MarketplaceBroadcastAddDTO, MarketplaceEvents } from '@typings/marketplace';
import { useMarketplaceActions } from './useMarketplaceActions';
import { useCallback } from 'react';
import { useNotification } from '@os/new-notifications/useNotification';
import { useTranslation } from 'react-i18next';

export const useMarketplaceService = () => {
  const { addListing, deleteListing } = useMarketplaceActions();
  const { enqueueNotification } = useNotification();
  const [t] = useTranslation();

  const addListingHandler = useCallback(
    (resp: MarketplaceBroadcastAddDTO) => {
      addListing(resp.listing);
      enqueueNotification({
        appId: 'MARKETPLACE',
        notisId: 'npwd:marketplace:newListingBroadcast',
        content: resp.listing.description,
        secondaryTitle: t('MARKETPLACE.NEW_LISTING'),
      });
    },
    [addListing, enqueueNotification],
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
