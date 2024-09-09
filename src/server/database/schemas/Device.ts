import { DBInstance } from '../knex';
import { createDbTable } from '../utils';

export interface Device {
  id: number;
  sim_card_id: string;
  created_at: Date;
  updated_at: Date;
}

export type InsertDevice = Pick<Device, 'sim_card_id'>;

export const createDevicesTable = () => {
  createDbTable('devices', (table) => {
    table.increments('id').primary();
    table.string('sim_card_id').nullable();
    table.dateTime('created_at').notNullable().defaultTo(DBInstance.fn.now());
    table.dateTime('updated_at').notNullable().defaultTo(DBInstance.fn.now());
  });
};
