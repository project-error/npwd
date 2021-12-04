import { listingState, useSetListings } from './state';
import { MarketplaceListing } from '@typings/marketplace';
import { useRecoilCallback } from 'recoil';

interface MarketplaceActionValues {
  deleteListing: (id: number) => void;
  addListing: (listing: MarketplaceListing) => void;
}

export const useMarketplaceActions = (): MarketplaceActionValues => {
  const setListings = useSetListings();

  const deleteListing = useRecoilCallback(
    ({ snapshot }) =>
      (id: number) => {
        const { state, contents } = snapshot.getLoadable(listingState);
        // Make sure our atom is actually loaded before we attempt a dispatch
        if (state !== 'hasValue') return;
        // Tts possible for the init fetch to fail and empty array is passed. In that case
        // block dispatch
        if (!contents.length) return;

        setListings((curListings) => [...curListings].filter((listing) => listing.id !== id));
      },
    [],
  );

  const addListing = useRecoilCallback(
    ({ snapshot }) =>
      (listing: MarketplaceListing) => {
        const { state } = snapshot.getLoadable(listingState);
        // Make sure our atom is actually loaded before we attempt a dispatch
        if (state !== 'hasValue') return;

        setListings((curListings) => [listing, ...curListings]);
      },
    [setListings],
  );

  return { deleteListing, addListing };
};
