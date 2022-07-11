import { Bills } from '../../../typings/debtkollector';
import DbInterface from '../db/db_wrapper';

export class _BillsDB {
  async fetchBills(identifier: string): Promise<Bills[]> {
    if (identifier == null) return null;
    const query = 'SELECT target, label, amount FROM billing WHERE identifier = ? ORDER BY amount';
    const [results] = await DbInterface._rawExec(query, [identifier]);
    return <Bills[]>results;
  }
}

const BillsDB = new _BillsDB();
export default BillsDB;
