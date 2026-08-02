import { useCallback } from 'react';
import { useSetListings } from './state';
import { MarketplaceListing } from '@typings/marketplace';

interface MarketplaceActionValues {
  deleteListing: (ids: number[]) => void;
  addListing: (listing: MarketplaceListing) => void;
}

export const useMarketplaceActions = (): MarketplaceActionValues => {
  const setListings = useSetListings();

  const deleteListing = useCallback(
    (ids: number[]) => {
      setListings((curListings) => [...curListings].filter((listing) => !ids.includes(listing.id)));
    },
    [setListings],
  );

  const addListing = useCallback(
    (listing: MarketplaceListing) => {
      setListings((curListings) => [listing, ...curListings]);
    },
    [setListings],
  );

  return { deleteListing, addListing };
};
