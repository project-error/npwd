import { createDbTable, DATABASE_PREFIX } from '../utils';
import { DBInstance } from '../knex';
import { Call } from '../../../shared/Types';

export type InsertCall = Pick<Call, 'caller_id' | 'receiver_id'> &
  Partial<Pick<Call, 'is_anonymous'>>;

export const createCallsTable = () => {
  createDbTable('call', (table) => {
    table.increments('id').primary();
    table.integer('caller_id').unsigned().references('id').inTable(`${DATABASE_PREFIX}sim_card`);
    table.integer('receiver_id').unsigned().references('id').inTable(`${DATABASE_PREFIX}sim_card`);
    table.boolean('is_anonymous').notNullable().defaultTo(false);
    table.dateTime('created_at').notNullable().defaultTo(DBInstance.fn.now());
    table.dateTime('accepted_at').nullable();
    table.dateTime('ended_at').nullable();
    table.enum('ended_by', ['caller', 'receiver']).nullable();
    table.dateTime('declined_at').nullable();
    table.dateTime('missed_at').nullable();
    table.dateTime('acknowledged_at').nullable();
  });
};
