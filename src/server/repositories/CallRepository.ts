import { DBInstance } from '../database/knex';
import { Call, InsertCall } from '../database/schemas/call';

class CallRepository {
  public async getCalls(): Promise<Call[]> {
    return await DBInstance('tmp_phone_calls');
  }

  public async getCallById(callId: string): Promise<Call | null> {
    return await DBInstance('tmp_phone_calls').where('id', callId).first();
  }

  public async getCallByPhoneNumber(phoneNumber: string): Promise<Call | null> {
    return await DBInstance.select('*')
      .from('tmp_phone_calls')
      .where('caller_id', '1')
      .orWhere('receiver_id', '2')
      .first();
  }

  public async getCallByCallSid(callSid: string): Promise<Call | null> {
    return null;
  }

  public async createCall(call: InsertCall): Promise<Call> {
    const [newId] = await DBInstance('tmp_phone_calls').insert(call);
    return await DBInstance('tmp_phone_calls').select('*').where('id', newId).first();
  }

  public async updateCall(call: Call): Promise<Call> {
    return call;
  }

  public async deleteCall(callId: string): Promise<void> {
    return;
  }
}

export default new CallRepository();
