import { Call } from './schemas/call';
import { Device } from './schemas/Device';
import { SimCard } from './schemas/SimCard';
import { DATABASE_PREFIX } from './utils';

const tbCalls = `${DATABASE_PREFIX}_calls`;
const tbDevices = `${DATABASE_PREFIX}_devices`;
const tbSimCards = `${DATABASE_PREFIX}_sim_cards`;

declare module 'knex/types/tables' {
  interface Tables {
    [tbCalls]: Call;
    [tbDevices]: Device;
    [tbSimCards]: SimCard;
  }
}
