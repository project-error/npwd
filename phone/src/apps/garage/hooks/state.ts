import { atom, selector, useRecoilValue } from 'recoil';
import { GarageEvents, GarageHub, GarageVehicle } from '@typings/garage';
import fetchNui from '@utils/fetchNui';
import { ServerPromiseResp } from '@typings/common';
import { isEnvBrowser } from '@utils/misc';
import { BrowserGarageState, ENUM_VEHICLE, ENUM_GARAGE } from '../utils/constants';

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

export const fetchVehicleNameByHash = (model: string) => {
  if (model == null) return null;
  return ENUM_VEHICLE[model] ? ENUM_VEHICLE[model] : '🔮 IMPORT';
};

export const fetchGarageNameById = (garageId: number): GarageHub => {
  if (garageId == null) return null;
  return ENUM_GARAGE[garageId] ? ENUM_GARAGE[garageId] : null;
};
