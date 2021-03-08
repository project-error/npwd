import { pool } from './db';
import config from '../utils/config';
import { getIdentifier, getIdentifierByPhoneNumber, getSource, usePlayer } from './functions';
import { mainLogger } from './sv_logger';
import { IPlayer } from '../typings/players';
import events from '../utils/events';
import { getOrCreateProfile } from './sv_twitter';

//db = DatabaseConfig  //helper variable for use in server function

//we pass the server configuration to the phone so that we can have phone or
//app specific settings configured by the server owner
//ESX.RegisterServerCallback('phone:phoneConfig', function(source, cb) {
//    cb(Config)
//});

interface Credentials {
  phone_number: string;
}

export const Players = new Map<number, IPlayer>();

// gets the identifers
on('playerJoining', async () => {
  const pSource = (global as any).source;

  let identifier = null;

  const identifers = getPlayerIdentifiers(pSource);
  identifier = identifers[1].split(':')[1];

  if (!identifier) {
    throw new Error('Identifier could not be found.');
  }

  try {
    await generatePhoneNumber(identifier);
  } catch (e) {
    mainLogger.error(`Failed to generate a phone number, ${e.message}`, {
      source: pSource,
    });
  }

  const { name, phone_number } = await usePlayer(identifier);

  Players.set(pSource, { identifier, source: pSource, name, phone_number });

  emitNet(events.PHONE_IS_READY, pSource);
});

// Generate phone number

function getRandomPhoneNumber() {
  let randomNumber: string = null;

  if (!config.general.useDashNumber) {
    randomNumber = Math.floor(Math.random() * 10000000).toString(); // 10000000 creates a number with 7 characters.
  } else {
    randomNumber = Math.floor(Math.random() * 10000000)
      .toString()
      .replace(/(\d{3})(\d{4})/, '$1-$2');
    // The numbers inside {} in replace() can be changed to how many digits you want on each side of the dash.
    // Example: 123-4567
  }
  mainLogger.verbose(`Getting random number: ${randomNumber}`);

  return randomNumber;
}

async function generatePhoneNumber(identifier: string) {
  const getQuery = `SELECT phone_number FROM users WHERE identifier = ?`;
  const [results] = await pool.query(getQuery, [identifier]);
  const result = <any[]>results;
  const phoneNumber = result[0]?.phone_number;

  if (!phoneNumber) {
    let existingId;
    let newNumber;
    do {
      newNumber = getRandomPhoneNumber();
      try {
        existingId = await getIdentifierByPhoneNumber(newNumber);
      } catch (e) {
        existingId = false;
      }
    } while (existingId);
    mainLogger.verbose(`Inserting number into Database: ${newNumber}`);
    const query = 'UPDATE users SET phone_number = ? WHERE identifier = ?';
    await pool.query(query, [newNumber, identifier]);
  }
}

async function getCredentials(identifier: string): Promise<string> {
  const query = 'SELECT phone_number FROM users WHERE identifier = ?';
  const [result] = await pool.query(query, [identifier]);
  const number = <Credentials[]>result;
  if (number.length === 0) return '###-####';
  return number[0].phone_number;
}

onNet('phone:getCredentials', async () => {
  const _source = getSource();
  try {
    const identifier = getIdentifier(_source);
    const number = await getCredentials(identifier);
    emitNet('phone:sendCredentials', _source, number);
  } catch (e) {
    mainLogger.error(`Failed to get a number, ${e.message}`, {
      source: _source,
    });
  }
});
