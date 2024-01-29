import { createClient } from '.';
import { AppRouter } from './example';

const client = createClient<AppRouter>();

client.player.giveMoney.emit({ playerId: 1, amount: 100 });
client.player.giveMoney.emitNet({ playerId: 1, amount: 100 });
