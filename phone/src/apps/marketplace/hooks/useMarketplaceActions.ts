import { useCallback } from 'react';
import { listingState, useSetListings } from './state';
import { MarketplaceListing } from '../../../../../typings/marketplace';
import { useRecoilValueLoadable } from 'recoil';

interface MarketplaceActionValues {
  deleteListing: (id: number) => void;
  addListing: (listing: MarketplaceListing) => void;
}

export const useMarketplaceActions = (): MarketplaceActionValues => {
  const { state: valueLoading, contents } = useRecoilValueLoadable(listingState);
  const setListings = useSetListings();

  const deleteListing = useCallback(
    (id: number) => {
      // Make sure our atom is actually loaded before we attempt a dispatch
      if (valueLoading !== 'hasValue') return;
      // Tts possible for the init fetch to fail and empty array is passed. In that case
      // block dispatch
      if (!contents.length) return;

      setListings((curListings) => [...curListings].filter((listing) => listing.id !== id));
    },
    [setListings, valueLoading, contents],
  );

  const addListing = useCallback(
    (listing: MarketplaceListing) => {
      // Make sure our atom is actually loaded before we attempt a dispatch
      if (valueLoading !== 'hasValue') return;
      setListings((curListings) => [listing, ...curListings]);
    },
    [setListings, valueLoading],
  );

  return { deleteListing, addListing };
};
