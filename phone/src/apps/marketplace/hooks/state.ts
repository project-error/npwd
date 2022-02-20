import { atom, selector, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { ServerPromiseResp } from '@typings/common';
import { MarketplaceEvents, MarketplaceListing } from '@typings/marketplace';
import fetchNui from '@utils/fetchNui';
import { isEnvBrowser } from '@utils/misc';
import { IListingFormValues } from '../components/MarketplaceForm';

const defaultData: MarketplaceListing[] = [
  {
    id: 1,
    name: 'Charles Carlsberg',
    number: '111-1134',
    username: 'Taso',
    title: 'eeeeeeeeeeeeeeeeeeeeeeeee',
    description:
      'skldfsdEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
    url: 'https://i.file.glass/706Y3.jpeg',
    price: 1020,
  },
  {
    id: 2,
    name: 'John Doe',
    number: '666-6666',
    username: 'Taso',
    title: 'Material',
    price: 200,
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque at nunc a dolor sagittis fermentum id quis magna. Sed volutpat purus id lacus lobortis varius. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque at nunc a dolor sagittis fermentum id quis magna. Sed volutpat purus id lacus lobortis varius. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque at nunc a dolor sagittis fermentum id quis magna. Sed volutpat purus id lacus lobortis varius. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque at nunc a dolor sagittis fermentum id quis magna. Sed volutpat purus id lacus lobortis varius. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque at nunc a dolor sagittis fermentum id quis magna. Sed volutpat purus id lacus lobortis varius',
    url: '',
  },
  {
    id: 3,
    name: 'Sven Larsson',
    number: '666-6666',
    username: 'Poor',
    title: 'Material',
    price: 1200000,
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque at nunc a dolor sagittis fermentum id quis magna. Sed volutpat purus id lacus lobortis varius. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque at nunc a dolor sagittis fermentum id quis magna. Sed volutpat purus id lacus lobortis varius. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque at nunc a dolor sagittis fermentum id quis magna. Sed volutpat purus id lacus lobortis varius. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque at nunc a dolor sagittis fermentum id quis magna. Sed volutpat purus id lacus lobortis varius. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque at nunc a dolor sagittis fermentum id quis magna. Sed volutpat purus id lacus lobortis varius',
    url: 'https://i.file.glass/706Y3.jpeg',
  },
  {
    id: 4,
    name: 'Charles Carlsberg',
    number: '666-6666',
    username: 'Poor',
    title: 'No price',
    price: 0,
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque at nunc a dolor sagittis fermentum id quis magna. Sed volutpat purus id lacus lobortis varius. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque at nunc a dolor sagittis fermentum id quis magna. Sed volutpat purus id lacus lobortis varius. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque at nunc a dolor sagittis fermentum id quis magna. Sed volutpat purus id lacus lobortis varius. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque at nunc a dolor sagittis fermentum id quis magna. Sed volutpat purus id lacus lobortis varius. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque at nunc a dolor sagittis fermentum id quis magna. Sed volutpat purus id lacus lobortis varius',
    url: 'https://i.file.glass/706Y3.jpeg',
  },
  {
    id: 5,
    name: '',
    number: '666-6666',
    username: 'Poor',
    title: 'No seller',
    price: 900,
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque at nunc a dolor sagittis fermentum id quis magna. Sed volutpat purus id lacus lobortis varius. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque at nunc a dolor sagittis fermentum id quis magna. Sed volutpat purus id lacus lobortis varius. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque at nunc a dolor sagittis fermentum id quis magna. Sed volutpat purus id lacus lobortis varius. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque at nunc a dolor sagittis fermentum id quis magna. Sed volutpat purus id lacus lobortis varius. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque at nunc a dolor sagittis fermentum id quis magna. Sed volutpat purus id lacus lobortis varius',
    url: 'https://i.file.glass/706Y3.jpeg',
  },
];

export const listingState = atom<MarketplaceListing[]>({
  key: 'listings',
  default: selector({
    key: 'defaultListings',
    get: async () => {
      try {
        if (isEnvBrowser()) return defaultData;
        const resp = await fetchNui<ServerPromiseResp<MarketplaceListing[]>>(
          MarketplaceEvents.FETCH_LISTING,
        );
        return resp.data;
      } catch (e) {
        console.error(e);
        return [];
      }
    },
  }),
});

export const formState = atom<IListingFormValues>({
  key: 'form',
  default: {
    title: '',
    description: '',
    url: '',
    price: '',
  },
});

export const useListing = (id: number) => {
  const [listings] = useRecoilState(listingState);
  return listings.find((listing) => listing.id === id);
};

export const useListingValue = () => useRecoilValue(listingState);
export const useSetListings = () => useSetRecoilState(listingState);
export const useListings = () => useRecoilState(listingState);

export const useFormValue = () => useRecoilValue(formState);
export const useSetForm = () => useSetRecoilState(formState);
export const useForm = () => useRecoilState(formState);
