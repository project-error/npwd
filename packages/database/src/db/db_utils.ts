export const CONNECTION_STRING = 'mysql_connection_string';
interface Map {
  [key: string]: string;
}

/**
 * parse the connection string from the format server=127.0.0.1;database=es_extended;userid=user;password=pass
 * @param connectionString - mysql_connection_string value
 */
export function parseSemiColonFormat(connectionString: string): Map {
  const parts = connectionString
    .replace(/(?:host(?:name)|ip|server|data\s?source|addr(?:ess)?)=/gi, 'host=')
    .replace(/(?:user\s?(?:id|name)?|uid)=/gi, 'user=')
    .replace(/(?:pwd|pass)=/gi, 'password=')
    .replace(/(?:db)=/gi, 'database=')
    .split(';');

  if (parts.length === 1) {
    throw new Error(
      `Connection string ${connectionString} is in the incorrect format. Please follow the README.`,
    );
  }

  return parts.reduce<Record<string, string>>((connectionInfo, parameter) => {
    const [key, value] = parameter.split('=');
    if (value) connectionInfo[key] = value;
    return connectionInfo;
  }, {});
}
