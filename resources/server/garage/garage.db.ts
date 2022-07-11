import { GarageVehicle } from '../../../typings/garage';
import DbInterface from '../db/db_wrapper';

export class _GarageDB {
  async fetchListings(identifier: string): Promise<GarageVehicle[]> {
    console.log('we are at line 6 of garage/db.');
    if (identifier == null) return null;
    console.log(identifier);
    console.log('garage/db we have an identifier and now we are pinging the database.');
    const query =
      'SELECT plate, JSON_VALUE(vehicle, ?) AS model, garageId, health, stored FROM owned_vehicles WHERE owner = ? AND job = ? ORDER BY plate ASC;';
    const [results] = await DbInterface._rawExec(query, [`$.model`, identifier, 'civ']);
    console.log('we have results and now we send back to state.');
    return <GarageVehicle[]>results;
  }
}

const GarageDB = new _GarageDB();
export default GarageDB;
