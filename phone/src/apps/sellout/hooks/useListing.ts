import { useRecoilValue } from 'recoil';
import { MarketplaceListing } from '../../../../../typings/marketplace';
import { selloutState } from './state';

export const useListing = () => {
  return useRecoilValue<MarketplaceListing[]>(selloutState.listing);
};
