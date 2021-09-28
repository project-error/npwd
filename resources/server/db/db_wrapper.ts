import { pool } from './pool';
import { mainLogger } from '../sv_logger';
import { ResultSetHeader } from 'mysql2';
import { config } from '../server';
import { withProfile } from '../utils/withProfile';

const RESOURCE_NAME = GetCurrentResourceName();

// Replicates ghmattimysql API
class _DbInterface {
  private readonly logger = mainLogger.child({ module: 'DBInterface' });

  private async _internalQuery(query: string, values?: unknown) {
    try {
      if (config.database.profileQueries) return await withProfile(pool.execute, query, values);

      ScheduleResourceTick(RESOURCE_NAME);
      return await pool.query(query, values);
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
    ScheduleResourceTick(RESOURCE_NAME);
    return pool.query(query, values);
  }

  /**
   * Will execute a query and return the affected rows
   * @param query Query template
   * @param values Variable definition
   **/
  public async exec(query: string, values?: unknown) {
    const [res] = await this._internalQuery(query, values);
    return (<ResultSetHeader>res).affectedRows;
  }

  /**
   * Will insert a row and return the insertId
   * @param query Query template
   * @param values Variable definition
   **/
  public async insert(query: string, values?: unknown) {
    const [res] = await this._internalQuery(query, values);
    return (<ResultSetHeader>res).insertId;
  }

  /**
   * Will exec and return results
   * @todo Type safety can be improved
   */
  public async fetch<T = unknown>(query: string, values?: unknown): Promise<T> {
    const [res] = await this._internalQuery(query, values);
    const castRes = <unknown>res;
    return <T>castRes;
  }
}
const DbInterface = new _DbInterface();

export default DbInterface;
