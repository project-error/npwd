import {DbInterface, getDbConfig} from '@npwd/database';
import {config} from '@npwd/config/server';

export class _BootDb {
    /**
     * Check if the player table described in the config exists.
     *
     * @returns Boolean - If the player table exists.
     **/
    async doesPlayerTableExist(): Promise<boolean> {
        const tableSchema = getDbConfig();
        const query = `SELECT COUNT(*) as count
                       FROM information_schema.tables
                       WHERE table_schema = ?
                         AND table_name = ?`

        const [results] = await DbInterface._rawExec(query, [tableSchema.database, config.database.playerTable]);

        const result = <{ count: number }[]>results;

        return result[0].count > 0;
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
