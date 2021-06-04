import { atom, selector, useRecoilValue, useSetRecoilState } from 'recoil';
import { MarketplaceEvents, MarketplaceListing } from '../../../../../typings/marketplace';
import { fetchNui } from '../../../utils/fetchNui';

const defaultData: MarketplaceListing[] = [
  {
    id: 1,
    name: 'Some guy',
    number: '111-1134',
    username: 'Taso',
    title: 'eeeeeeeeeeeeeeeeeeeeeeeee',
    description:
      'skldfsdEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
    url: 'https://beta.iodine.gg/706Y3.jpeg',
  },
  {
    id: 2,
    name: 'Some other dude',
    number: '666-6666',
    username: 'Taso',
    title: 'Material',
    description: 'Selling my wife',
    url: '',
  },
];

const listingState = atom<MarketplaceListing[]>({
  key: 'listings',
  default: selector({
    key: 'defaultListings',
    get: async () => {
      try {
        return await fetchNui<MarketplaceListing[]>(MarketplaceEvents.FETCH_LISTING);
      } catch (e) {
        if (process.env.NODE_ENV === 'development' && !process.env.REACT_APP_IN_GAME) {
          return defaultData;
        }
      }
    },
  }),
});

export const useListingValue = () => useRecoilValue(listingState);
export const useSetListings = () => useSetRecoilState(listingState);
