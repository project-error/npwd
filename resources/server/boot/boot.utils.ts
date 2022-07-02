import { mainLogger } from '../sv_logger';
import { config } from '../config';

export const bootLogger = mainLogger.child({
  module: 'boot',
});

export const fatalDbError = (reason: string) => {
  throw new Error(
    '\n^1==============================================\n\n' +
      '!!! NPWD WAS UNABLE TO VALIDATE YOUR DATABASE AND FINISH STARTING !!!\n\n' +
      `${reason}\n\n` +
      'This error is most likely caused by incorrect values in the config.json file.\n\n' +
      '==============================================^0',
  );
};

const { identifierColumn, phoneNumberColumn } = config.database;
export const requiredDbColumns = [identifierColumn, phoneNumberColumn];

export const frameworkDependencies = {
  ['es_extended']: ['esx-npwd'],
  ['qb-core']: ['qb-npwd'],
};
