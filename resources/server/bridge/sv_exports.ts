import { generateUniquePhoneNumber } from '../misc/generateUniquePhoneNumber';
import { bridgeLogger } from './bridge.utils';

const exp = global.exports;

const logExport = (exportName: string, msg: string) => {
  bridgeLogger.debug(`[${exportName}] ${msg}`);
};

// Will generate and return a unique phone number
exp('generatePhoneNumber', async () => {
  const num = await generateUniquePhoneNumber();
  logExport('generatePhoneNumber', num);
  return num;
});
