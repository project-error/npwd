import { Call, InsertCall } from '../database/schemas/call';
import CallRepository from '../repositories/CallRepository';
import SimCardRepository from '../repositories/SimCardRepository';

class CallService {
  private readonly callRepository: typeof CallRepository;
  private readonly simCardRepository: typeof SimCardRepository;

  constructor(callRepository: typeof CallRepository, simCardRepository: typeof SimCardRepository) {
    this.callRepository = callRepository;
    this.simCardRepository = simCardRepository;
  }


  public async call(phoneNumber: string): Promise<void> {
    /**
     * 1. Find the sim card by the phone number.
     */
    const simCard = await this.simCardRepository.getSimCardByPhoneNumber(phoneNumber);

    if (!simCard) {
      throw new Error('Sim card not found');
    }

    /**
     * 2. Check if the sim card is active, if not, throw an error.
     */
    if (!simCard.is_active) {
      throw new Error('Sim card is not active');
    }

    /**
     * Check if a call already exists for the phone number.
     */
    const call = await this.getCallByPhoneNumber(phoneNumber);

    if (call) {
      throw new Error('Call already exists');
    }

    if (!call) {
      await this.createCall({
        caller_id: '1',
        receiver_id: '2',
      });
    }
  }

  public async getCallById(callId: string): Promise<Call | null> {
    return this.callRepository.getCallById(callId);
  }

  public async getCallByPhoneNumber(phoneNumber: string): Promise<Call | null> {
    return this.callRepository.getCallByPhoneNumber(phoneNumber);
  }

  public async getCallByCallSid(callSid: string): Promise<Call | null> {
    return this.callRepository.getCallByCallSid(callSid);
  }

  public async createCall(call: InsertCall): Promise<Call> {
    return this.callRepository.createCall(call);
  }

  public async updateCall(call: Call): Promise<Call> {
    return this.callRepository.updateCall(call);
  }

  public async deleteCall(callId: string): Promise<void> {
    return this.callRepository.deleteCall(callId);
  }

  public async getCalls(): Promise<Call[]> {
    return this.callRepository.getCalls();
  }
}

export default new CallService(CallRepository, SimCardRepository);
