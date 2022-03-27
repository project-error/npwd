import { pool } from './pool';
import { mainLogger } from '../sv_logger';
import { ResultSetHeader } from 'mysql2';
import { config } from '../config';

const RESOURCE_NAME = GetCurrentResourceName();

class _DbInterface {
  private readonly logger = mainLogger.child({ module: 'DBInterface' });

  private async _internalQuery(query: string, values?: any[]) {
    try {
      if (!values) values = [];

      if (config.database.profileQueries) {
        const startTime = process.hrtime();
        ScheduleResourceTick(RESOURCE_NAME);

        const res = await pool.execute(query, values);
        const timeMs = process.hrtime(startTime)[1] / 1e6;

        this.logger.info(`Executed query (${query} ${JSON.stringify(values)}) in ${timeMs}ms'`);
        return res;
      }

      ScheduleResourceTick(RESOURCE_NAME);
      return await pool.execute(query, values);
    } catch (e) {
      this.logger.error(
        `Error executing (${query} ${JSON.stringify(values)}) with error message ${e.message}`,
      );
    }
  }

  /**
   * This shouldn't be used but we keep it public just in case we need to do a
   * raw query with no wrappers whatsoever.
   * @todo This was a fast way of easily porting all our existing queries but should be moved away from
   * @deprecated
   */
  public async _rawExec(query: string, values?: any[]) {
    return await this._internalQuery(query, values);
  }

  /**
   * Will execute a query and return the affected rows
   * @param query Query template
   * @param values Variable definition
   **/
  public async exec(query: string, values?: any[]) {
    const [res] = await this._internalQuery(query, values);
    return (<ResultSetHeader>res).affectedRows;
  }

  /**
   * Will insert a row and return the insertId
   * @param query Query template
   * @param values Variable definition
   **/
  public async insert(query: string, values?: any[]) {
    const [res] = await this._internalQuery(query, values);
    return (<ResultSetHeader>res).insertId;
  }

  /**
   * Will exec and return results
   * @todo Type safety can be improved
   */
  public async fetch<T = unknown>(query: string, values?: any[]): Promise<T> {
    const [res] = await this._internalQuery(query, values);
    const castRes = <unknown>res;
    return <T>castRes;
  }
}
const DbInterface = new _DbInterface();

export default DbInterface;
