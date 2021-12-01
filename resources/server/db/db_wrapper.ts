import { pool } from './pool';
import { mainLogger } from '../sv_logger';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { config } from '../server';

// Replicates ghmattimysql API
class _DbInterface {
  private readonly logger = mainLogger.child({ module: 'DBInterface' });

  private async _internalQuery(query: string, values?: unknown) {
    try {
      const conn = await pool.getConnection();

      if (config.database.profileQueries) {
        const startTime = process.hrtime();
        const result = await conn.execute(query, values);
        this.logger.info(
          `${query} (${values}) execution time: ${process.hrtime(startTime)[1] / 1000000}ms`,
        );
        return result;
      }

      conn.release();
      return await pool.execute(query, values);
    } catch (e) {
      this.logger.error(`Error executing ${query} with error message ${e.message}`);
    }
  }

  /**
   * This shouldn't be used but we keep it public just in case we need to do a
   * raw query with no wrappers whatsoever.
   * @todo This was a fast way of easily porting all our existing queries but should be moved away from
   * @deprecated
   */
  public _rawExec(query: string, values?: unknown) {
    return pool.query(query, values);
  }

  /**
   * Will execute a query and return the affected rows
   * @param query Query template
   * @param values Variable definition
   **/
  public async exec(query: string, values?: unknown) {
    const [res] = (await this._internalQuery(query, values)) as ResultSetHeader[];
    return res.affectedRows;
  }

  /**
   * Will insert a row and return the insertId
   * @param query Query template
   * @param values Variable definition
   **/
  public async insert(query: string, values?: unknown) {
    const [res] = (await this._internalQuery(query, values)) as ResultSetHeader[];
    return res.insertId;
  }

  /**
   * Will exec and return results
   * @todo Type safety can be improved
   */
  public async fetch(query: string, values?: unknown) {
    const [res] = (await this._internalQuery(query, values)) as RowDataPacket[];
    return res;
  }
}
const DbInterface = new _DbInterface();

export default DbInterface;
