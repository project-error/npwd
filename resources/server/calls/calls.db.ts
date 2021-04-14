import { CallHistoryItem } from '../../../typings/call';
import { pool } from '../db';

export class CallsRepo {
  async saveCall(call: CallHistoryItem) {
    const query =
      'INSERT INTO npwd_calls (identifier, transmitter, receiver, start) VALUES (?, ?, ?, ?)';
    await pool.query(query, [call.identifier, call.transmitter, call.receiver, call.start]);
  }

  async updateCall(call: CallHistoryItem, isAccepted: boolean, end: number) {
    const query = 'UPDATE npwd_calls SET is_accepted=?, end=? WHERE identifier = ?';
    await pool.query(query, [isAccepted, end, call.identifier]);
  }

  async fetchCalls(phoneNumber: string, limit = 50): Promise<CallHistoryItem[] | CallHistoryItem> {
    const query =
      'SELECT * FROM npwd_calls WHERE receiver = ? OR transmitter = ? ORDER BY id DESC LIMIT ?';
    const [result] = await pool.query(query, [phoneNumber, phoneNumber, limit]);

    return <CallHistoryItem[]>result;
  }
}

export default new CallsRepo();
