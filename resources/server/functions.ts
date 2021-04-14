import { pool } from './db';
import { config } from './server';
import { mainLogger } from './sv_logger';
import { getRandomPhoneNumber } from './utils/getRandomPhoneNumber';

export async function generatePhoneNumber(identifier: string): Promise<string> {
  const getQuery = `SELECT phone_number FROM ${config.database.playerTable} WHERE ${config.database.identifierColumn} = ?`;
  const [results] = await pool.query(getQuery, [identifier]);
  const result = <any[]>results;
  const phoneNumber = result[0]?.phone_number;

  // Generate a new phone number if there isn't one present
  if (!phoneNumber)
    if (!phoneNumber) {
      let existingId;
      let newNumber;

      do {
        newNumber = getRandomPhoneNumber();
        try {
          existingId = await getIdentifierByPhoneNumber(newNumber);
        } catch (e) {
          existingId = false;
        }
      } while (existingId);

      mainLogger.debug(
        `Generated a new number for identifier: ${identifier}, number: ${phoneNumber}`,
      );
      const query = `UPDATE ${config.database.playerTable} SET phone_number = ? WHERE ${config.database.identifierColumn} = ?`;
      await pool.query(query, [newNumber, identifier]);
      return newNumber;
    }

  return phoneNumber;
}
