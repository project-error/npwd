import { CONNECTION_STRING } from '../db';
import DbInterface from '../db/db_wrapper';
import { parseUri } from '../db/parseUri';
import { config } from '../server';

const mysqlConnectionString = GetConvar(CONNECTION_STRING, 'none');

export class _BootDb {
  /**
   * Check if the player table described in the config exists.
   *
   * @returns Boolean - If the player table exists.
   **/
  async doesPlayerTableExist(): Promise<boolean> {
    const tableSchema = parseUri(mysqlConnectionString).database;

    const tblsh = `Tables_in_${tableSchema}`;
    const query = 'SHOW TABLES WHERE ' + `\`${tblsh}\`` + 'LIKE ?';

    const [results] = await DbInterface._rawExec(query, [config.database.playerTable]);

    const tableDetails = <{ [key: string]: string }[]>results;

    return !!tableDetails.length;
  }

  /**
   * Fetches all columns from the player table described in the config.
   *
   * @returns Array<string> - String array of column names.
   **/
  async getPlayerTableColumns(): Promise<string[]> {
    const query = `SHOW COLUMNS IN ${config.database.playerTable}`;
    const [results] = await DbInterface._rawExec(query, []);

    const columnResults = <{ Field: string }[]>results;

    return columnResults.map((columnData) => columnData.Field);
  }
}

const BootDb = new _BootDb();

export default BootDb;
