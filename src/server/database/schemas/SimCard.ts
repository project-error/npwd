import { Device, SimCard } from '../../../shared/Types';
import { DBInstance } from '../knex';
import { createDbTable } from '../utils';

export interface SimCardWithDevice extends SimCard, Device {}

export type InsertSimCard = Pick<SimCard, 'phone_number'>;

export const createSimCardsTable = () => {
  createDbTable('sim_card', (table) => {
    table.increments('id').primary();
    table.string('phone_number').notNullable().unique();
    table.boolean('is_active').notNullable().defaultTo(true);
    table.dateTime('created_at').notNullable().defaultTo(DBInstance.fn.now());
    table.dateTime('updated_at').notNullable().defaultTo(DBInstance.fn.now());
  });
};
