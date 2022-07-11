import { GarageVehicle } from '../../../typings/garage';
import DbInterface from '../db/db_wrapper';

export class _GarageDB {
  async fetchListings(identifier: string): Promise<GarageVehicle[]> {
    if (identifier == null) return null;
    const query =
      'SELECT plate, JSON_VALUE(vehicle, ?) AS model, garageId, health, stored FROM owned_vehicles WHERE owner = ? AND job = ? ORDER BY plate ASC;';
    const [results] = await DbInterface._rawExec(query, [`$.model`, identifier, 'civ']);
    return <GarageVehicle[]>results;
  }
}

const GarageDB = new _GarageDB();
export default GarageDB;
