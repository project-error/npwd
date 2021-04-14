import { CallHistoryItem } from '../../../typings/call';
import { pool } from '../db';

export class CallsRepo {
  async saveCallDB(call: CallHistoryItem) {
    const query =
      'INSERT INTO npwd_calls (identifier, transmitter, receiver, start) VALUES (?, ?, ?, ?)';
    await pool.query(query, [call.identifier, call.transmitter, call.receiver, call.start]);
  }

  async updateCallDB(call: CallHistoryItem, isAccepted: boolean, end: number) {
    const query = 'UPDATE npwd_calls SET is_accepted=?, end=? WHERE identifier = ?';
    await pool.query(query, [isAccepted, end, call.identifier]).catch(e =);
  }

  async fetchCallsDB(phoneNumber: string): Promise<CallHistoryItem[]> {
    const query = 'SELECT * FROM npwd_calls WHERE receiver = ? OR transmitter = ? ORDER BY id DESC';
    const [result] = await pool.query(query, [phoneNumber, phoneNumber]);
    return <CallHistoryItem[]>result;
  }
}

export default new CallsRepo()