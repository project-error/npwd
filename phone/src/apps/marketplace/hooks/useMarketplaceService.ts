import { useNuiEvent } from 'fivem-nui-react-lib';
import {
  MarketPlaceBroadcastData,
  MarketplaceDeleteDTO,
  MarketplaceEvents,
  MarketplaceListing,
} from '../../../../../typings/marketplace';
import { useSetListings } from './state';

export const useMarketplaceService = () => {
  const setListings = useSetListings();

  useNuiEvent<MarketPlaceBroadcastData>(
    'SELLOUT',
    MarketplaceEvents.BROADCAST_EVENT,
    ({ type, listing }) => {
      if (type === 'ADD') {
        const typeCastListing = listing as MarketplaceListing;
        return setListings((curState) => [...curState, typeCastListing]);
      }

      if (type === 'DELETE') {
        const deleteDTO = listing as MarketplaceDeleteDTO;
        return setListings((currVal) => {
          const arrayPos = currVal.map((item) => item.id).indexOf(deleteDTO.id);

          return [...currVal].splice(arrayPos);
        });
      }
    },
  );
};
