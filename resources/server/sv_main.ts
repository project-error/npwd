import { ESX } from './server';
import { pool } from './db';
import config from '../utils/config';
import { getIdentifierByPhoneNumber, usePhoneNumber } from './functions';

//db = DatabaseConfig  //helper variable for use in server function

//we pass the server configuration to the phone so that we can have phone or
//app specific settings configured by the server owner
//ESX.RegisterServerCallback('phone:phoneConfig', function(source, cb) {
//    cb(Config)
//});

interface Credentials {
  phone_number: string;
}

// Generate phone number

function getRandomPhoneNumber() {
  let randomNumber: string = null;

  if (!config.general.useDashNumber) {
    randomNumber = Math.floor(Math.random() * 10000000).toString(); // 10000000 creates a number with 7 characters.
  } else {
    randomNumber = Math.floor(Math.random() * 10000000)
      .toString()
      .replace(/(\d{3})(\d{4})/, '$1-$2'); // ;
    // The numbers inside {} in replace() can be changed to how many digits you want on each side of the dash.
    // Example: 123-4567
  }

  return randomNumber;
}

async function generatePhoneNumber(identifier: string) {
  const _identifier = identifier;
  let phoneNumber = await usePhoneNumber(_identifier);
  let id = await getIdentifierByPhoneNumber(phoneNumber);

  do {
    if (!phoneNumber) {
      phoneNumber = await getRandomPhoneNumber();
      const query = 'UPDATE users SET phone_number = ? WHERE identifier = ?';
      await pool.query(query, [phoneNumber, _identifier]);
    } else {
      break;
    }
  } while (id);
}

async function getCredentials(identifier: string): Promise<string> {
  const query = 'SELECT phone_number FROM users WHERE identifier = ?';
  const [result] = await pool.query(query, [identifier]);
  const number = <Credentials[]>result;
  if (number.length === 0) return '###-####';
  return number[0].phone_number;
}

onNet('esx:playerLoaded', async (playerId: number, xPlayer: any) => {
  const identifier = xPlayer.identifier;
  await generatePhoneNumber(identifier);
});

onNet('phone:getCredentials', async () => {
  try {
    const _source = (global as any).source;
    const xPlayer = ESX.GetPlayerFromId(_source);
    const _identifier = xPlayer.getIdentifier();
    const number = await getCredentials(_identifier);
    emitNet('phone:sendCredentials', _source, number);
  } catch (error) {
    console.log('Failed to get number. ', error);
  }
});