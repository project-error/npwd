import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';
import {
  MarketplaceEvents,
  MarketplaceListing,
  MarketplaceListingBase,
} from '@typings/marketplace';
import { isEnvBrowser } from '@utils/misc';
import { fetchNuiData } from '@common/query/fetch-nui-query';
import { useQueryState, useQueryStateValue, useSetQueryState } from '@common/query/query-state';

const defaultData: MarketplaceListing[] = [
  {
    id: 1,
    name: 'Some guy',
    number: '111-1134',
    username: 'Taso',
    title: 'eeeeeeeeeeeeeeeeeeeeeeeee',
    description:
      'skldfsdEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
    url: 'https://i.fivemanage.com/images/XrjtfSCOCgOKVkbskxCU1vLrQrqXasaNli6VAMuk.png',
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

export const MARKETPLACE_LISTINGS_QUERY_KEY = ['marketplace', 'listings'] as const;

const fetchListings = async () => {
  try {
    return await fetchNuiData<MarketplaceListing[]>(MarketplaceEvents.FETCH_LISTING);
  } catch (e) {
    if (isEnvBrowser()) return defaultData;
    console.error(e);
    return [];
  }
};

export const formState = atom<MarketplaceListingBase>({
  title: '',
  description: '',
  url: '',
});

export const useListingValue = () =>
  useQueryStateValue<MarketplaceListing[]>(MARKETPLACE_LISTINGS_QUERY_KEY, fetchListings, []);
export const useSetListings = () =>
  useSetQueryState<MarketplaceListing[]>(MARKETPLACE_LISTINGS_QUERY_KEY, []);
export const useListings = () =>
  useQueryState<MarketplaceListing[]>(MARKETPLACE_LISTINGS_QUERY_KEY, fetchListings, []);

export const useFormValue = () => useAtomValue(formState);
export const useSetForm = () => useSetAtom(formState);
export const useForm = () => useAtom(formState);
