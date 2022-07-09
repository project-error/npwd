import { GarageVehicle } from '../../../typings/garage';
import DbInterface from '../db/db_wrapper';

export class _GarageDB {
  async fetchListings(identifier: string): Promise<GarageVehicle[]> {
    if (identifier == null) return null; // Edge Case.
    const query = 'SELECT * FROM owned_vehicles WHERE identifier = ? ORDER BY display ASC';
    const [results] = await DbInterface._rawExec(query, [identifier]);
    return <GarageVehicle[]>results;
  }
}

const GarageDB = new _GarageDB();
export default GarageDB;
