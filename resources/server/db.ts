import mysql from 'mysql2/promise';
import { ConnectionStringParser } from "connection-string-parser";

const CONNECTION_STRING = 'mysql_connection_string';
// we require set mysql_connection_string "mysql://root:password@localhost/es_extended?charset=utf8mb4" to be set in the config
const mysqlConnectionString = GetConvar(CONNECTION_STRING, null);
if (mysqlConnectionString === null) { 
    throw new Error(`No connection string provided. make sure ${CONNECTION_STRING} is set in your config.`)
}

const connectionStringParser  = new ConnectionStringParser({ scheme: 'mysql', hosts: []});
const connectionOjbect = connectionStringParser .parse(mysqlConnectionString);

export const pool = mysql.createPool({
    host: connectionOjbect.hosts[0].host,
    user: connectionOjbect.username,
    password: connectionOjbect.password,
    database: connectionOjbect.endpoint,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });
