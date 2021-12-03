import { ConnectionOptions } from 'mysql2';

export const CONNECTION_STRING = 'mysql_connection_string';
export const DEFAULT_HOST = 'localhost';
export const DEFAULT_USER = 'root';

interface Map {
  [key: string]: string;
}

/**
 * parse the connection string from the format server=127.0.0.1;database=es_extended;userid=user;password=pass
 * @param connectionString - mysql_connection_string value
 */
export function parseSemiColonFormat(connectionString: string): Map {
  const options = connectionString
    .replace(/(?:host(?:name)|ip|server|data\s?source|addr(?:ess)?)=/gi, 'host=')
    .replace(/(?:user\s?(?:id|name)?|uid)=/gi, 'user=')
    .replace(/(?:pwd|pass)=/gi, 'password=')
    .replace(/(?:db)=/gi, 'database=')
    .split(';')
    .reduce((connectionInfo: Map, parameter: string) => {
      const [key, value] = parameter.split('=');
      connectionInfo[key] = value;
      return connectionInfo;
    }, {});

  options.user = options.user || DEFAULT_USER;
  options.host = options.host || DEFAULT_HOST;

  return options;
}

/**
 * sets default connection options when creating the mysql pool connection
 */
export function connectionOptions(options: ConnectionOptions): ConnectionOptions {
  options.namedPlaceholders = true;
  options.waitForConnections = true;
  options.connectionLimit = 10;
  options.queueLimit = 0;

  return options;
}
