import { DBInstance } from '../knex';
import { createDbTable } from '../utils';

export interface SimCard {
  id: number;
  phone_number: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export type InsertSimCard = Pick<SimCard, 'phone_number'>;

export const createSimCardsTable = () => {
  createDbTable('sim_cards', (table) => {
    table.increments('id').primary();
    table.string('phone_number').notNullable();
    table.boolean('is_active').notNullable().defaultTo(true);
    table.dateTime('created_at').notNullable().defaultTo(DBInstance.fn.now());
    table.dateTime('updated_at').notNullable().defaultTo(DBInstance.fn.now());
  });
};
