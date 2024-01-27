import { createClient } from '.';
import { AppRouter } from './example';

const client = createClient<AppRouter>();

client.giveMoney.emitNet({
  amount: 100,
  playerId: 1,
});
