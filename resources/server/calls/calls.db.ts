import { CallHistoryItem } from '../../../typings/call';
import { FetchDefaultLimits } from '../utils/ServerConstants';
import DbInterface from '../db/db_wrapper';

export class CallsRepo {
  async saveCall(call: CallHistoryItem): Promise<void> {
    const query =
      'INSERT INTO npwd_calls (identifier, transmitter, receiver, `start`) VALUES (?, ?, ?, ?)';
    await DbInterface._rawExec(query, [
      call.identifier,
      call.transmitter,
      call.receiver,
      call.start,
    ]);
  }

  async updateCall(call: CallHistoryItem, isAccepted: boolean, end: number): Promise<void> {
    const query = 'UPDATE npwd_calls SET is_accepted=?, end=? WHERE identifier = ?';
    await DbInterface._rawExec(query, [isAccepted, end, call.identifier]);
  }

  async fetchCalls(
    phoneNumber: string,
    limit = FetchDefaultLimits.CALLS_FETCH_LIMIT,
  ): Promise<CallHistoryItem[]> {
    const query =
      'SELECT * FROM npwd_calls WHERE receiver = ? OR transmitter = ? ORDER BY id DESC LIMIT ?';
    const [result] = await DbInterface._rawExec(query, [
      phoneNumber,
      phoneNumber,
      limit.toString(),
    ]);

    return <CallHistoryItem[]>result;
  }
}

export default new CallsRepo();
