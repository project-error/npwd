import { config } from '../server';
import DbInterface from '../db/db_wrapper';
import { generateUniquePhoneNumber } from './generateUniquePhoneNumber';
import { playerLogger } from '../players/player.utils';

export async function findOrGeneratePhoneNumber(identifier: string): Promise<string> {
  const query = `SELECT ${config.database.phoneNumberColumn} FROM ${config.database.playerTable} WHERE ${config.database.identifierColumn} = ? LIMIT 1`;
  const result = await DbInterface.fetch(query, [identifier]);

  if (result && result[0][config.database.phoneNumberColumn])
    return result[0][config.database.phoneNumberColumn] as string;

  playerLogger.debug('Phone number was returned as null, generating new number');
  const gennedNumber = await generateUniquePhoneNumber();

  playerLogger.debug(`Phone number generated > ${gennedNumber}`);

  const updateQuery = `UPDATE ${config.database.playerTable} SET ${config.database.phoneNumberColumn} = ? WHERE ${config.database.identifierColumn} = ?`;
  // Update profile with new generated number
  await DbInterface.exec(updateQuery, [gennedNumber, identifier]);

  return gennedNumber;
}
