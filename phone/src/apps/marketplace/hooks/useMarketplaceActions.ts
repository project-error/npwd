import { useCallback } from 'react';
import { useSetListings } from './state';
import { MarketplaceListing } from '../../../../../typings/marketplace';

interface MarketplaceActionValues {
  deleteListing: (id: number) => void;
  addListing: (listing: MarketplaceListing) => void;
}

export const useMarketplaceActions = (): MarketplaceActionValues => {
  const setListings = useSetListings();

  const deleteListing = useCallback(
    (id: number) => {
      setListings((curListings) => [...curListings].filter((listing) => listing.id !== id));
    },
    [setListings],
  );

  const addListing = useCallback(
    (listing: MarketplaceListing) => {
      setListings((curListings) => [...curListings, listing]);
    },
    [setListings],
  );

  return { deleteListing, addListing };
};
