import { atom } from 'recoil';
import { MarketplaceListing } from '../../../../../typings/marketplace';

export const selloutState = {
  listing: atom<MarketplaceListing[]>({
    key: 'listing',
    default: [],
  }),
};
