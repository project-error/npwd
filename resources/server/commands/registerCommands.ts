import { mainLogger } from '../sv_logger';
import { config } from '../config';
import DbInterface from '../db/db_wrapper';

interface ColumnInfo {
  COLUMN_NAME: string;
  DATA_TYPE: string;
  CHARACTER_MAXIMUM_LENGTH: number;
  IS_NULLABLE: string;
}

const npwdDebugDumpCommand = async ([src]: [number]): Promise<void> => {
  // We require this be called from the server console.
  if (src !== 0) return;

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
    const playerTableResults = await DbInterface.fetch<ColumnInfo[]>(
      `SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH, IS_NULLABLE
       FROM INFORMATION_SCHEMA.COLUMNS
       WHERE TABLE_NAME = '${config.database.playerTable}'`,
    );

    const tableExists = playerTableResults.length > 0;

    if (tableExists) {
      mainLogger.info('Player Table Info >');
      mainLogger.info(playerTableResults);
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
