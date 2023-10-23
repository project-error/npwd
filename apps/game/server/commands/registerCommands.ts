import { mainLogger } from '../sv_logger';
import { config } from '../config';
import { CONNECTION_STRING, DbInterface, parseUri } from '@npwd/database';

const mysqlConnectionString = GetConvar(CONNECTION_STRING, 'none');

const npwdDebugDumpCommand = async (src: number): Promise<void> => {
  // We require this be called from the server console.
  if (src !== 0) return;

  const tableSchema = parseUri(mysqlConnectionString).database;

  if (config.debug.level === 'error') {
    console.log('SET DEBUG LEVEL TO INFO/SILLY TO SEE LOGS');
  }

  mainLogger.info('NPWD DEBUG DUMP STARTED, THIS WILL WRITE TO THE SV_NPWD.LOG FILE');
  mainLogger.info('Resource Config >');
  mainLogger.info(config);

  const versionInfo = GetResourceMetadata(GetCurrentResourceName(), 'version', 0);
  mainLogger.info(`Manifest VERSION > ${versionInfo}`);

  const fxServerVersion = GetConvar('version', 'unknown');
  mainLogger.info(`FXServer VERSION > ${fxServerVersion}`);

  const activePlayerCount = GetNumPlayerIndices();
  mainLogger.info(`Connected Player Count > ${activePlayerCount}`);

  try {
    const playerTableResults = await DbInterface._rawExec(
      `SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH, IS_NULLABLE
       FROM information_schema.COLUMNS
       WHERE TABLE_NAME = ?
         AND TABLE_SCHEMA = ?`,
      [config.database.playerTable, tableSchema],
    );

    const tableExists = playerTableResults.length > 0;

    if (tableExists) {
      mainLogger.info('Player Table Info >');
      mainLogger.info(playerTableResults[0]);
    } else {
      mainLogger.error(
        `Unable to locate schema metadata for specified player table of ${config.database.playerTable}. Maybe it doesn't exist?`,
      );
    }
  } catch (e) {
    mainLogger.error(`Failed to collect debug info for player table, ${e.message}`);
  }
};

export const registerCommands = (): void => {
  RegisterCommand('npwd-debug-dump', npwdDebugDumpCommand, false);
};
