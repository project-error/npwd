import { config } from '../server';
import DbInterface from '../db/db_wrapper';
import { generateUniquePhoneNumber } from './generateUniquePhoneNumber';

export async function findOrGeneratePhoneNumber(identifier: string): Promise<string> {
  const query = `SELECT ${config.database.phoneNumberColumn} FROM ${config.database.playerTable} WHERE ${config.database.identifierColumn} = ? LIMIT 1`;
  const [res] = await DbInterface._rawExec(query, [identifier]);

  const castRes = res as Record<string, unknown>[];

  if (castRes && castRes[0][config.database.phoneNumberColumn] !== null) return castRes[0][config.database.phoneNumberColumn] as string;

  const gennedNumber = await generateUniquePhoneNumber();

  const updateQuery = `UPDATE ${config.database.playerTable} SET ${config.database.phoneNumberColumn} = ? WHERE ${config.database.identifierColumn} = ?`;
  // Update profile with new generated number
  await DbInterface._rawExec(updateQuery, [gennedNumber, identifier]);

  return gennedNumber;
}
