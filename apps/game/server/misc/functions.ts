import { config } from '../server';
import { DbInterface } from '@npwd/database';
import { generateUniquePhoneNumber } from './generateUniquePhoneNumber';
import { playerLogger } from '../players/player.utils';
import { ResultSetHeader } from 'mysql2';

export async function findOrGeneratePhoneNumber(identifier: string): Promise<string> {
  const query = `SELECT ${config.database.phoneNumberColumn} FROM ${config.database.playerTable} WHERE ${config.database.identifierColumn} = ? LIMIT 1`;
  const [res] = await DbInterface._rawExec(query, [identifier]);

  playerLogger.debug('Find user for number generation data >');
  playerLogger.debug(res);

  const castRes = res as Record<string, unknown>[];

  if (castRes && castRes[0] && castRes[0][config.database.phoneNumberColumn] !== null) {
    return castRes[0][config.database.phoneNumberColumn] as string;
  }

  playerLogger.debug('Phone number was returned as null, generating new number');
  const gennedNumber = await generateUniquePhoneNumber();

  playerLogger.debug(`Phone number generated > ${gennedNumber}`);

  let dmlQuery: string | undefined = undefined;
  if (config.database.addToTableWhenMissing && castRes.length === 0) {
    playerLogger.debug(`Adding player to table`);
    dmlQuery = `INSERT INTO ${config.database.playerTable} (${config.database.phoneNumberColumn}, ${config.database.identifierColumn}) VALUES (?, ?)`;
  } else {
    dmlQuery = `UPDATE ${config.database.playerTable} SET ${config.database.phoneNumberColumn} = ? WHERE ${config.database.identifierColumn} = ?`;
  }



  // Update profile with new generated number
  const result = await DbInterface._rawExec(dmlQuery, [gennedNumber, identifier]);

  // Temporary bad typing, need to update dbInterface
  if (!result || !result[0] || !(result[0] as ResultSetHeader).affectedRows) {
    playerLogger.error(`Failed to store phone number in database`);
    playerLogger.error(
      `UPDATE ${config.database.playerTable} SET ${config.database.phoneNumberColumn} = ${gennedNumber} WHERE ${config.database.identifierColumn} = ${identifier}`,
    );
  }

  return gennedNumber;
}
