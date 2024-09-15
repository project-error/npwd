import { Call, Device, SimCard } from '../../shared/Types';
import { DATABASE_PREFIX } from './utils';

const tbCalls = `${DATABASE_PREFIX}calls`;
const tbDevices = `${DATABASE_PREFIX}devices`;
const tbSimCards = `${DATABASE_PREFIX}sim_cards`;

export type TableName = typeof tbCalls | typeof tbDevices | typeof tbSimCards;

declare module 'knex/types/tables' {
  interface Tables {
    [tbCalls]: Call;
    [tbDevices]: Device;
    [tbSimCards]: SimCard;
  }
}
