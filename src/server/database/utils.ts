import knex from 'knex';
import { ConnectionOptions } from 'mysql2';
import { DBInstance } from './knex';

function parseUri(connectionString: string) {
  const splitMatchGroups = connectionString.match(
    new RegExp(
      '^(?:([^:/?#.]+):)?(?://(?:([^/?#]*)@)?([\\w\\d\\-\\u0100-\\uffff.%]*)(?::([0-9]+))?)?([^?#]+)?(?:\\?([^#]*))?$',
    ),
  ) as RegExpMatchArray;

  if (!splitMatchGroups)
    throw new Error(`mysql_connection_string structure was invalid (${connectionString})`);

  const authTarget = splitMatchGroups[2] ? splitMatchGroups[2].split(':') : [];

  const options = {
    user: authTarget[0] || undefined,
    password: authTarget[1] || undefined,
    host: splitMatchGroups[3],
    port: parseInt(splitMatchGroups[4]),
    database: splitMatchGroups[5]?.replace(/^\/+/, ''),
    ...(splitMatchGroups[6] &&
      splitMatchGroups[6].split('&').reduce<Record<string, string>>((connectionInfo, parameter) => {
        const [key, value] = parameter.split('=');
        connectionInfo[key] = value;
        return connectionInfo;
      }, {})),
  };

  return options;
}

export function getConnectionOptions(): ConnectionOptions {
  // https://github.com/overextended/oxmysql/blob/bfe660b9d3419ca6a7b94c465c6d74ae20971c08/src/config.ts
  const mysql_connection_string = GetConvar(
    'mysql_connection_string',
    process.env.MYSQL_CONNECTION_STRING ?? '',
  );

  const options: Record<string, any> = mysql_connection_string.includes('mysql://')
    ? parseUri(mysql_connection_string)
    : mysql_connection_string
        .replace(/(?:host(?:name)|ip|server|data\s?source|addr(?:ess)?)=/gi, 'host=')
        .replace(/(?:user\s?(?:id|name)?|uid)=/gi, 'user=')
        .replace(/(?:pwd|pass)=/gi, 'password=')
        .replace(/(?:db)=/gi, 'database=')
        .split(';')
        .reduce<Record<string, string>>((connectionInfo, parameter) => {
          const [key, value] = parameter.split('=');
          if (key) connectionInfo[key] = value;
          return connectionInfo;
        }, {});

  for (const key of ['dateStrings', 'flags', 'ssl']) {
    const value = options[key];

    if (typeof value === 'string') {
      try {
        options[key] = JSON.parse(value);
      } catch (err) {
        console.log(`^3Failed to parse property ${key} in configuration (${err})!^0`);
      }
    }
  }

  const flags: string[] = options.flags || [];
  flags.push(options.database ? 'CONNECT_WITH_DB' : '-CONNECT_WITH_DB');

  return {
    connectTimeout: 60000,
    trace: false,
    supportBigNumbers: true,
    jsonStrings: true,
    ...options,
    flags: flags,
  };
}

export const DATABASE_PREFIX = 'tmp_phone';
export const createDbTable = async (
  _tableName: string,
  callback: (table: knex.Knex.CreateTableBuilder) => void,
  dropIfExists = process.env.DROP_TABLE_BEFORE_CREATING === 'true',
) => {
  const tableName = `${DATABASE_PREFIX}_${_tableName}`;
  const tableExists = await DBInstance.schema.hasTable(tableName);

  if (tableExists) {
    if (dropIfExists) {
      console.log(`Dropping table "${tableName}"`);
      await DBInstance.schema.dropTableIfExists(tableName);
    } else {
      console.log(`Table "${tableName}" already exists`);
      return;
    }
  }

  console.log(`Creating table "${tableName}"`);
  return DBInstance.schema.createTable(tableName, callback);
};
