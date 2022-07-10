import { atom, selector, useRecoilValue } from 'recoil';
import { GarageEvents, GarageVehicle } from '@typings/garage';
import fetchNui from '@utils/fetchNui';
import { ServerPromiseResp } from '@typings/common';
import { isEnvBrowser } from '@utils/misc';
import { BrowserGarageState } from '../utils/constants';

export const garageState = atom<GarageVehicle[]>({
  key: 'vehicleListings',
  default: selector({
    key: 'defaultVehicleListings',
    get: async () => {
      try {
        const resp = await fetchNui<ServerPromiseResp<GarageVehicle[]>>(
          GarageEvents.GET_VEHICLE_LIST,
        );
        return resp.data;
      } catch (e) {
        if (isEnvBrowser()) return BrowserGarageState;
        console.error(e);
        return [];
      }
    },
  }),
});

export const useGrabVehicleList = () => useRecoilValue(garageState);
