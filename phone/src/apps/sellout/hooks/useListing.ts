import { useRecoilValue } from 'recoil';
import { MarketplaceListing } from '../../../common/typings/marketplace';
import { selloutState } from './state';

interface ListingHook {
  listings: MarketplaceListing[];
}

export const useListing = (): ListingHook => {
  const listings = useRecoilValue(selloutState.listing);
  return { listings };
};
