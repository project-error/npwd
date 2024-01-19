import { config } from '../server';
import { DbInterface } from '@npwd/database';
import { playerLogger } from '../players/player.utils';
import {mainLogger} from "../sv_logger";

const exp = global.exports;

const genNumber = (length: number): string => {
  const addAmount = 1;
  let localMax = 11;

  if (length > localMax) {
    return genNumber(localMax) + genNumber(length - localMax);
  }

  localMax = Math.pow(10, length + addAmount);
  const min = localMax / 10;
  const number = Math.floor(Math.random() * (localMax - min + 1)) + min;

  const strNumber = '' + number;

  return strNumber.substr(addAmount);
};

/*
const generateUsNumber = (): string => {
  const rawNumber = genNumber(10);
  return rawNumber.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');

};
*/

function generatePhoneNumber(pattern: string): string {
  // Extract digit groups from the pattern
  const digitGroups = pattern.match(/\d+/g);

  if (!digitGroups) {
    mainLogger.error('Invalid phone number format');
    throw new Error('Invalid phone number format');
  }

  // Generate random numbers for each group
  const randomNumberParts = digitGroups.map(group => {
    const length = parseInt(group);
    let randomNumber = '';
    for (let i = 0; i < length; i++) {
      randomNumber += Math.floor(Math.random() * 10).toString();
    }
    return randomNumber;
  });

  // Join the parts with a dash if more than one group, otherwise return as is
  return randomNumberParts.join(randomNumberParts.length > 1 ? '-' : '');
}

/**/
export async function generateUniquePhoneNumber(): Promise<string> {
  if (config.customPhoneNumber.enabled) {
    try {
      const { exportResource, exportFunction } = config.customPhoneNumber;
      return await exp[exportResource][exportFunction]();
    } catch (e) {
      playerLogger.error(e.message);
      playerLogger.error('Please check your config for custom number generation');
    }
  }

  const query = `SELECT EXISTS(SELECT * FROM ${config.database.playerTable} WHERE ${config.database.phoneNumberColumn} = ?)`;

  const dashNumber = generatePhoneNumber(config.general.phoneNumberFormat);

  const [results] = await DbInterface._rawExec(query, [dashNumber]);

  if (!results) return generateUniquePhoneNumber();

  return dashNumber;
}
