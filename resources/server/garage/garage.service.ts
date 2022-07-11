import PlayerService from '../players/player.service';
import { garageLogger } from './garage.utils';
import GarageDB, { _GarageDB } from './garage.db';
import { GarageVehicle } from '../../../typings/garage';
import { PromiseEventResp, PromiseRequest } from '../lib/PromiseNetEvents/promise.types';

class _GarageService {
  private readonly garageDB: _GarageDB;

  constructor() {
    this.garageDB = GarageDB;
    garageLogger.debug('Garage service started');
  }

  async handleFetchListings(req: PromiseRequest<void>, resp: PromiseEventResp<GarageVehicle[]>) {
    try {
      const identifier = PlayerService.getIdentifier(req.source);
      // Grabs Vehicles pertaining to the player.
      const listings = await this.garageDB.fetchListings(identifier);
      resp({ data: listings, status: 'ok' });
    } catch (e) {
      garageLogger.error(`Failed to fetch vehicles, ${e.message}`, {
        source: req.source,
      });
      resp({ status: 'error', errorMsg: 'GENERIC_DB_ERROR' });
    }
  }
}

const GarageService = new _GarageService();
export default GarageService;
