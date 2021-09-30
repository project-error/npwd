import { config } from '../server';
import DbInterface from '../db/db_wrapper';

export class PlayerRepo {
  async fetchIdentifierFromPhoneNumber(phoneNumber: string): Promise<string | null> {
    const query = `SELECT ${config.database.identifierColumn} FROM ${config.database.playerTable} WHERE ${config.database.phoneNumberColumn} = ?`;
    const [results] = await DbInterface._rawExec(query, [phoneNumber]);
    // Get identifier from results
    return (results as any[])[0][config.database.identifierColumn] || null;
  }
}

export default new PlayerRepo();
