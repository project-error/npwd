import { config } from '../server';
import { mainLogger } from '../sv_logger';
import { getRandomPhoneNumber } from '../utils/getRandomPhoneNumber';
import PlayerService from '../players/player.service';
import DbInterface from '../db/db_wrapper';

export async function generatePhoneNumber(identifier: string): Promise<string> {
  const getQuery = `SELECT phone_number FROM ${config.database.playerTable} WHERE ${config.database.identifierColumn} = ?`;
  const [results] = await DbInterface._rawExec(getQuery, [identifier]);
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
          existingId = await PlayerService.getIdentifierByPhoneNumber(newNumber);
        } catch (e) {
          existingId = false;
        }
      } while (existingId);

      mainLogger.debug(
        `Generated a new number for identifier: ${identifier}, number: ${phoneNumber}`,
      );
      const query = `UPDATE ${config.database.playerTable} SET phone_number = ? WHERE ${config.database.identifierColumn} = ?`;
      await DbInterface._rawExec(query, [newNumber, identifier]);
      return newNumber;
    }

  return phoneNumber;
}
