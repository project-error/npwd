import knex from 'knex';
import { getConnectionOptions } from './utils';
import { createCallsTable } from './schemas/Call';
import { createDevicesTable } from './schemas/Device';
import { createSimCardsTable } from './schemas/SimCard';
import { createMessageTable } from './schemas/Message';
import { createReadReceiptTable } from './schemas/ReadReceipt';
import { createConversationTable } from './schemas/Conversation';
import { createContactsTable } from './schemas/Contact';

export let DBInstance: knex.Knex;

export function initDB() {
  const options = getConnectionOptions();

  const conn = knex({
    client: 'mysql2',
    dialect: 'mariadb',
    connection: {
      port: options.port,
      host: options.host,
      password: options.password,
      user: options.user,
      database: options.database,
      flags: options.flags,
    },
  });

  DBInstance = conn;

  conn
    .raw('SELECT 1')
    .then(() => {
      console.log('Connected to database');
    })
    .catch((err) => {
      console.error('Failed to connect to database');
      console.error(err);
    });

  createCallsTable();
  createDevicesTable();
  createSimCardsTable();
  createMessageTable();
  createConversationTable();
  createReadReceiptTable();
  createContactsTable();
}
