import { createDbTable } from '../utils';
import { DBInstance } from '../knex';

export interface Call {
  id: number;
  caller_id: string;
  receiver_id: string;

  is_anonymous: boolean;

  created_at: Date;
  accepted_at: Date;
  ended_at: Date;
  declined_at: Date;
}

export type InsertCall = Pick<Call, 'caller_id' | 'receiver_id'> &
  Partial<Pick<Call, 'is_anonymous'>>;

export const createCallsTable = () => {
  createDbTable('calls', (table) => {
    table.increments('id').primary();
    table.string('caller_id').notNullable();
    table.string('receiver_id').notNullable();
    table.boolean('is_anonymous').notNullable().defaultTo(false);
    table.dateTime('created_at').notNullable().defaultTo(DBInstance.fn.now());
    table.dateTime('accepted_at').nullable();
    table.dateTime('ended_at').nullable();
    table.dateTime('declined_at').nullable();
  });
};
