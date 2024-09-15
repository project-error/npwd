import { createDbTable, DATABASE_PREFIX } from '../utils';
import { DBInstance } from '../knex';
import { Message } from '../../../shared/Types';

export type InsertMessage = Pick<Message, 'receiver_id' | 'sender_id' | 'content'>;

export const createMessageTable = () => {
  createDbTable('message', (table) => {
    table.increments('id').primary();
    table
      .integer('sender_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable(`${DATABASE_PREFIX}sim_card`);
    table
      .integer('receiver_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable(`${DATABASE_PREFIX}sim_card`);
    table.string('content').notNullable();
    table.dateTime('created_at').notNullable().defaultTo(DBInstance.fn.now());
  });
};
