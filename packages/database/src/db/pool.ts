import mysql from 'mysql2/promise';
import {CONNECTION_STRING} from './db_utils';
import {mainLogger} from '@npwd/logger/server';
import {parseUri2} from './parseUri';

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
            ? parseUri2(mysqlConnectionString)
            : mysqlConnectionString
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


        return mysql.createPool({
            ...config,
            connectTimeout: 60000,
            host: config.host,
            database: config.database,
            port: parseInt(config.port as string, 10),
            user: config.user,
            password: config.password,
        });
    } catch (e) {
        mainLogger.error(`SQL Connection Pool Error: ${e.message}`, {
            connection: mysqlConnectionString,
        });
    }
}


export const getDbConfig = () => {
    const config = mysqlConnectionString.includes('mysql://')
        ? parseUri2(mysqlConnectionString)
        : mysqlConnectionString
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

    return config;
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
