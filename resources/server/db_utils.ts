export const CONNECTION_STRING = 'mysql_connection_string';
export const DEFAULT_PORT = 3306;
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
  const parts = connectionString.split(';');
  if (parts.length === 1) {
    throw new Error(`Connection string ${connectionString} is in the incorrect format. Please follow the README.`);
  }

  return parts.reduce((connectionInfo: Map, part) => {
    const [key, value] = part.split('=');
    connectionInfo[key] = value;
    return connectionInfo;
  }, {});
}

/**
 * allowed variable names: host | server | data source | datasource | addr | address
 * @param config - database config variables parsed from mysql_connection_string
 */
export function getServerHost(config: Map): string {
  return (
    config.host ||
    config.server ||
    config['data source'] ||
    config.datasource ||
    config.addr ||
    config.address ||
    DEFAULT_HOST
  );
}

/**
 * allowed variable names: user | user id | userid | user name | username | uid
 * @param config - database config variables parsed from mysql_connection_string
 */
export function getUserId(config: Map): string {
  return (
    config.user ||
    config['user id'] ||
    config.userid ||
    config['user name'] ||
    config.username ||
    config.uid ||
    DEFAULT_USER
  );
}

/**
 * Note: We are allowing no password as many FiveM servers love to not use one for an ungodly reason.
 * allowed variable names: password | pwd
 * @param config - database config variables parsed from mysql_connection_string
 */
export function getPassword(config: Map): string | undefined {
  const password = config.password || config.pwd;
  if (!password) return undefined;
  return password;
}
