import { createDbTable, DATABASE_PREFIX } from '../utils';

export const createReadReceiptTable = async () => {
  await createDbTable('read_receipt', (table) => {
    table.increments('id').primary();
    table
      .integer('message_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable(`${DATABASE_PREFIX}message`)
      .onDelete('CASCADE');
    table
      .integer('simcard_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable(`${DATABASE_PREFIX}sim_card`)
      .onDelete('CASCADE');
  });
};
