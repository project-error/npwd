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
  const strNumber = String(number);
  return strNumber.substring(addAmount);
};

const generateUsNumber = (): string => {
  return '555' + genNumber(6);
};

/**/
export async function generateUniquePhoneNumber(): Promise<string> {
  const query = `SELECT EXISTS(SELECT * FROM npwd_sim WHERE phone_number = ?)`;
  const dashNumber = generateUsNumber();

  const [results] = await DbInterface._rawExec(query, [dashNumber]);

  if (!results) return generateUniquePhoneNumber();

  return dashNumber;
}
