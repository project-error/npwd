import { config } from '../server';
import DbInterface from '../db/db_wrapper';

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

const generateUsNumber = (): string => {
  const rawNumber = genNumber(10);
  return rawNumber.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
};

/**/
export async function generateUniquePhoneNumber(): Promise<string> {
  const query = `SELECT EXISTS(SELECT * FROM ${config.database.playerTable} WHERE ${config.database.phoneNumberColumn} = ?)`;
  const dashNumber = generateUsNumber();

  const [results] = await DbInterface._rawExec(query, dashNumber);

  if (!results) return generateUniquePhoneNumber();

  return dashNumber;
}
