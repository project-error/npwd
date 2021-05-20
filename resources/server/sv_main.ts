import { pool } from './db';
import { mainLogger } from './sv_logger';
import { PhoneEvents } from '../../typings/phone';
import PlayerService from './players/player.service';
import { getSource } from './utils/miscUtils';
import { config } from './server';

interface Credentials {
  phone_number: string;
}

async function getCredentials(identifier: string): Promise<string> {
  const query = `SELECT phone_number FROM ${config.database.playerTable} WHERE ${config.database.identifierColumn} = ?`;
  const [result] = await pool.query(query, [identifier]);
  const number = <Credentials[]>result;
  if (number.length === 0) return '###-####';
  return number[0].phone_number;
}

onNet('phone:getCredentials', async () => {
  const _source = getSource();
  try {
    const identifier = PlayerService.getIdentifier(_source);
    const number = await getCredentials(identifier);
    emitNet(PhoneEvents.SEND_CREDENTIALS, _source, number);
  } catch (e) {
    mainLogger.error(`Failed to get a number, ${e.message}`, {
      source: _source,
    });
  }
});
