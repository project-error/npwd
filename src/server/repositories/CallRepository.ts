import { Call, CallWithPhoneNumbers } from '../../shared/Types';
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

  public async getCallsBySid(sid: number): Promise<Call[]> {
    return await DBInstance(tableName)
      .where('receiver_id', sid)
      .orWhere('caller_id', sid)
      .orderBy('created_at', 'desc');
  }

  public async createCall(call: InsertCall): Promise<Call> {
    const [newId] = await DBInstance(tableName).insert(call);
    return await DBInstance(tableName)
      .select('*')
      .where('tmp_phone_call.id', newId)
      .leftJoin('tmp_phone_sim_card', 'tmp_phone_sim_card.id', 'tmp_phone_call.receiver_id')
      .leftJoin(
        'tmp_phone_sim_card as tmp_phone_sim_card2',
        'tmp_phone_sim_card2.id',
        'tmp_phone_call.caller_id',
      )
      .select(
        'tmp_phone_call.*',
        'tmp_phone_sim_card.phone_number as receiver_phone_number',
        'tmp_phone_sim_card2.phone_number as caller_phone_number',
      )
      .first();
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

  public async getActiveCalls(simCardId: number): Promise<CallWithPhoneNumbers[]> {
    return await DBInstance(tableName)
      .where('ended_at', null)
      .andWhere(function () {
        this.where('receiver_id', simCardId).orWhere('caller_id', simCardId);
      })
      .leftJoin('tmp_phone_sim_card', 'tmp_phone_sim_card.id', 'tmp_phone_call.receiver_id')
      .leftJoin(
        'tmp_phone_sim_card as tmp_phone_sim_card2',
        'tmp_phone_sim_card2.id',
        'tmp_phone_call.caller_id',
      )
      .select(
        'tmp_phone_call.*',
        'tmp_phone_sim_card.phone_number as receiver_phone_number',
        'tmp_phone_sim_card2.phone_number as caller_phone_number',
      );
  }

  public async updateCall(call: Call): Promise<Call> {
    return await DBInstance(tableName).where('id', call.id).update(call);
  }

  public async deleteCall(_callId: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
}

export default new CallRepository();
