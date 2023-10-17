import mysql from 'mysql2/promise';
import { CONNECTION_STRING, parseSemiColonFormat } from './db_utils';
import { mainLogger } from '@npwd/logger/server';

// we require set mysql_connection_string  to be set in the config
const mysqlConnectionString = GetConvar(CONNECTION_STRING, 'none');
if (mysqlConnectionString === 'none') {
  const error = new Error(
    `No connection string provided. make sure "${CONNECTION_STRING}" is set in your config.`,
  );
  mainLogger.error(error.message);
  throw error;
}

/**
 * Most fivem servers utilize fivem-mysql-async (https://brouznouf.github.io/fivem-mysql-async/) and
 * define a environment variable "mysql_connection_string" in their configurations. We will try to
 * maintain backwards compatibility with this.
 *
 * fivem-mysql-async allows for two different connection string formats defined here:
 * https://brouznouf.github.io/fivem-mysql-async/config/ and we need to handle both of them.
 */
export function generateConnectionPool() {
  try {
    const config = mysqlConnectionString.includes('mysql://')
      ? { uri: mysqlConnectionString }
      : parseSemiColonFormat(mysqlConnectionString);

    return mysql.createPool({
      connectTimeout: 60000,
      ...config,
    });
  } catch (e) {
    mainLogger.error(`SQL Connection Pool Error: ${e.message}`, {
      connection: mysqlConnectionString,
    });
  }
}

export const pool = generateConnectionPool();

export async function withTransaction(queries: Promise<any>[]): Promise<any[]> {
  const connection = await pool.getConnection();
  connection.beginTransaction();

  try {
    const results = await Promise.all(queries);
    await connection.commit();
    await connection.release();
    return results;
  } catch (err) {
    mainLogger.warn(`Error when submitting queries in transaction, ${err.message}`);
    await connection.rollback();
    await connection.release();
    return Promise.reject(err);
  }
}
