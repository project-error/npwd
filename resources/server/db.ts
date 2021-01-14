import mysql from 'mysql2/promise';
import { ConnectionStringParser } from 'connection-string-parser';
import {
  CONNECTION_STRING,
  DEFAULT_PORT,
  parseSemiColonFormat,
  getServerHost,
  getUserId,
  getPassword,
} from './db_utils';

// we require set mysql_connection_string  to be set in the config
const mysqlConnectionString = GetConvar(CONNECTION_STRING, null);
if (mysqlConnectionString === null) {
  throw new Error(
    `No connection string provided. make sure "${CONNECTION_STRING} is set in your config.`
  );
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
  if (mysqlConnectionString.includes('database=')) {
    // This is checking for this format:
    // set mysql_connection_string "server=127.0.0.1;database=es_extended;userid=user;password=pass"
    const config = parseSemiColonFormat(mysqlConnectionString);
    return mysql.createPool({
      host: getServerHost(config),
      user: getUserId(config),
      port: config.port ? parseInt(config.port) : DEFAULT_PORT,
      password: getPassword(config),
      database: config.database,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  } else {
    // This is checking for this format:
    // set mysql_connection_string "mysql://root:pass@127.0.0.1/es_extended?charset=utf8mb4"
    const connectionStringParser = new ConnectionStringParser({
      scheme: 'mysql',
      hosts: [],
    });
    const connectionOjbect = connectionStringParser.parse(
      mysqlConnectionString
    );

    return mysql.createPool({
      host: connectionOjbect.hosts[0].host,
      user: connectionOjbect.username,
      password: connectionOjbect.password,
      database: connectionOjbect.endpoint,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
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
    console.warn('Error when submitting queries');
    await connection.rollback();
    await connection.release();
    return Promise.reject(err);
  }
}
