import { atom, selector, useRecoilValue } from 'recoil';
import { GarageEvents, GarageVehicle } from '@typings/garage';
import fetchNui from '@utils/fetchNui';
import { ServerPromiseResp } from '@typings/common';
import { isEnvBrowser } from '@utils/misc';
import { buildRespObj } from '@utils/misc';
import { BrowserGarageState } from '../utils/constants';

export const garageState = {
  vehicleList: atom<GarageVehicle[]>({
    key: 'garageState',
    default: selector({
      key: 'garageStateValue',
      get: async () => {
        try {
          const result = await fetchNui<ServerPromiseResp<GarageVehicle[]>>(
            GarageEvents.GET_VEHICLE_LIST,
            undefined,
            buildRespObj(BrowserGarageState),
          );
          if (result.status !== 'ok') {
            console.error({ result });
          }
          return result.data;
        } catch (e) {
          if (isEnvBrowser()) return BrowserGarageState;
          console.error(e);
          return null;
        }
      },
    }),
  }),
};

export const useGrabVehicleList = () => useRecoilValue(garageState.vehicleList);
