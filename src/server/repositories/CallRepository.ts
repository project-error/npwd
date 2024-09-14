import { Call } from '../../shared/Types';
import { DBInstance } from '../database/knex';
import { InsertCall } from '../database/schemas/Call';

const tableName = 'tmp_phone_call';
class CallRepository {
  public async getCalls(): Promise<Call[]> {
    return await DBInstance(tableName);
  }

  public async getCallById(callId: number): Promise<Call | null> {
    return await DBInstance(tableName).where('id', callId).first();
  }

  public async getCallByPhoneNumber(phoneNumber: string): Promise<Call | null> {
    return await DBInstance.select('*')
      .from(tableName)
      .where('caller_id', '1')
      .orWhere('receiver_id', '2')
      .first();
  }

  public async getCallsBySid(sid: number): Promise<Call[]> {
    return await DBInstance(tableName)
      .where('receiver_id', sid)
      .orWhere('caller_id', sid)
      .orderBy('created_at', 'desc');
  }

  public async createCall(call: InsertCall): Promise<Call> {
    const [newId] = await DBInstance(tableName).insert(call);
    return await DBInstance(tableName).select('*').where('id', newId).first();
  }

  public async getPendingCalls(simCardId: number): Promise<Call[]> {
    return await DBInstance(tableName)
      .where('receiver_id', simCardId)
      .andWhere('accepted_at', null)
      .andWhere('ended_at', null)
      .andWhere('declined_at', null)
      .andWhere('missed_at', null);
  }

  public async getMissedCalls(simCardId: number): Promise<Call[]> {
    return await DBInstance(tableName)
      .where('receiver_id', simCardId)
      .andWhereNot('missed_at', null)
      .andWhere('acknowledged_at', null);
  }

  public async getActiveCalls(simCardId: number): Promise<Call[]> {
    return await DBInstance(tableName)
      .where('ended_at', null)
      .andWhere(function () {
        this.where('receiver_id', simCardId).orWhere('caller_id', simCardId);
      });
  }

  public async updateCall(call: Call): Promise<Call> {
    return await DBInstance(tableName).where('id', call.id).update(call);
  }

  public async deleteCall(callId: string): Promise<void> {
    return;
  }
}

export default new CallRepository();
