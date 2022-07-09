import { GarageEvents, GarageVehicle } from '../../../typings/garage';
import { garageLogger } from './garage.utils';
import GarageService from './garage.service';
import { onNetPromise } from '../lib/PromiseNetEvents/onNetPromise';

onNetPromise<void, GarageVehicle[]>(GarageEvents.GET_VEHICLE_LIST, async (reqObj, resp) => {
  GarageService.handleFetchListings(reqObj, resp).catch((e) => {
    garageLogger.error(
      `Error occurred in fetch vehicle event (${reqObj.source}), Error: ${e.message}`,
    );
    resp({ status: 'error', errorMsg: 'INTERNAL_ERROR' });
  });
});
