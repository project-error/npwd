import { RouterContext } from 'fivem-router';
import { InsertCall } from '../database/schemas/Call';
import CallRepository from '../repositories/CallRepository';
import SimCardRepository from '../repositories/SimCardRepository';
import {
  CallAlreadyAcceptedError,
  CallHasEndedError,
  CallNotFoundError,
  DeviceNotFoundError,
  InvalidPhoneNumberError,
  OngoingCallError,
  PendingCallNotFoundError,
  PhoneNumberNotFoundError,
  SimCardNotActiveError,
  SimcardNotFoundError,
  UnauthorizedError,
} from '../../shared/Errors';
import DeviceRepository from '../repositories/DeviceRepository';
import { Call } from '../../shared/Types';
import { getPlayerSrcBySid } from '../utils/player';
import { parseObjectToIsoString } from '../utils/date';
import { handleError } from '../utils/errors';

class CallService {
  private readonly callRepository: typeof CallRepository;
  private readonly simCardRepository: typeof SimCardRepository;
  private readonly deviceRepository: typeof DeviceRepository;

  constructor(
    callRepository: typeof CallRepository,
    simCardRepository: typeof SimCardRepository,
    deviceRepository: typeof DeviceRepository,
  ) {
    this.callRepository = callRepository;
    this.simCardRepository = simCardRepository;
    this.deviceRepository = deviceRepository;
  }

  public async call({ device }: RouterContext, phoneNumber: string): Promise<Call> {
    if (!device.sim_card_id) {
      throw new SimcardNotFoundError('CALLER');
    }

    if (!device.sim_card_is_active) {
      throw new SimCardNotActiveError('CALLER');
    }

    /** Check if caller has active call */
    const activeCalls = await this.callRepository.getActiveCalls(device.sim_card_id);

    if (activeCalls.length > 0) {
      throw new OngoingCallError();
    }

    /**
     * TODO: Implement the logic to check if the user has the phone making the call.
     */

    /**
     * 2. Find the sim card by the phone number.
     */
    const receiverSimcard = await this.simCardRepository.getSimCardByPhoneNumber(phoneNumber);

    if (!receiverSimcard) {
      throw new PhoneNumberNotFoundError();
    }

    /** Check if the user tries to call themselves. */
    if (receiverSimcard.id === device.sim_card_id) {
      throw new InvalidPhoneNumberError();
    }

    /**
     * TODO: Check if the different sim cards are in the same device. (If this is possible)
     */

    /**
     * 4. Check if the sim card is active, if not, throw an error.
     */
    if (!receiverSimcard.is_active) {
      throw new SimCardNotActiveError('RECEIVER');
    }

    if (!receiverSimcard.deviceId) {
      throw new DeviceNotFoundError('RECEIVER');
    }

    /**
     * Create a call.
     */
    return await this.createCall({
      caller_id: device.sim_card_id,
      receiver_id: receiverSimcard.id,
    });
  }

  public async getPendingCalls(ctx: RouterContext): Promise<Call[]> {
    const device = await this.deviceRepository.getDeviceById(ctx.device.id);

    if (!device) {
      throw new DeviceNotFoundError('CALLER');
    }

    if (!device.sim_card_id) {
      throw new SimcardNotFoundError('CALLER');
    }

    return await this.callRepository.getPendingCalls(device.sim_card_id);
  }

  public async getCallById(ctx: RouterContext, callId: number): Promise<Call | null> {
    const call = await this.callRepository.getCallById(callId);

    if (!call) {
      throw new CallNotFoundError();
    }

    if (call.caller_id !== ctx.device.sim_card_id && call.receiver_id !== ctx.device.sim_card_id) {
      throw new UnauthorizedError();
    }

    return call;
  }

  public async acceptCall(ctx: RouterContext, callId: number): Promise<Call> {
    const call = await this.getCallById(ctx, callId);

    if (call.receiver_id !== ctx.device.sim_card_id) {
      throw new CallNotFoundError();
    }

    if (call.accepted_at) {
      throw new CallAlreadyAcceptedError();
    }

    call.accepted_at = new Date();
    await this.updateCall(call);
    return call;
  }

  public async declineCall(ctx: RouterContext, callId: number): Promise<Call> {
    const call = await this.getCallById(ctx, callId);

    if (call.declined_at) {
      throw new CallHasEndedError();
    }

    const receiverDevice = await this.deviceRepository.getDeviceById(ctx.device.id);

    if (call.receiver_id !== receiverDevice.sim_card_id) {
      throw new CallNotFoundError();
    }

    const endedAt = new Date();
    call.ended_at = endedAt;
    call.declined_at = endedAt;
    await this.updateCall(call);
    return call;
  }

  public async endCall(ctx: RouterContext, callId: number): Promise<Call> {
    const call = await this.getCallById(ctx, callId);

    if (call.ended_at) {
      throw new CallHasEndedError();
    }

    const isCaller = call.caller_id === ctx.device.sim_card_id;
    const endedAt = new Date();

    if (!call.accepted_at && isCaller) {
      call.missed_at = endedAt;
    }

    call.ended_at = endedAt;
    call.ended_by = isCaller ? 'caller' : 'receiver';
    await this.updateCall(call);
    return call;
  }

  public async acknowledgeCall(ctx: RouterContext, callId: number): Promise<Call> {
    const call = await this.getCallById(ctx, callId);

    if (!call.missed_at) {
      throw new CallNotFoundError();
    }

    const receiverDevice = await this.deviceRepository.getDeviceById(ctx.device.id);

    if (call.receiver_id !== receiverDevice.sim_card_id) {
      throw new CallNotFoundError();
    }

    call.acknowledged_at = new Date();
    await this.updateCall(call);
    return call;
  }

  public async acknowledgeMissedCalls({ device }: RouterContext): Promise<Call[]> {
    if (!device.sim_card_id) {
      throw new SimcardNotFoundError('CALLER');
    }

    const missedCalls = await this.callRepository.getMissedCalls(device.sim_card_id);

    return await Promise.all(
      missedCalls.map(async (call) => {
        call.acknowledged_at = new Date();
        await this.updateCall(call);
        return call;
      }),
    );
  }

  public async getMissedCalls({ device }: RouterContext): Promise<Call[]> {
    return await this.callRepository.getMissedCalls(device.sim_card_id);
  }

  public async getMyCalls({ device }: RouterContext): Promise<Call[]> {
    return await this.callRepository.getCallsBySid(device.sim_card_id);
  }

  public async getActiveCall(ctx: RouterContext): Promise<Call> {
    const activeCalls = await this.callRepository.getActiveCalls(ctx.device.sim_card_id);

    if (activeCalls.length === 0) {
      throw new CallNotFoundError();
    }

    return activeCalls[0];
  }

  public async getPendingCall(ctx: RouterContext): Promise<Call> {
    const pendingCalls = await this.callRepository.getPendingCalls(ctx.device.sim_card_id);
    console.log('Getting pending calls', pendingCalls);

    if (pendingCalls.length === 0) {
      throw new PendingCallNotFoundError();
    }

    return pendingCalls[0];
  }

  public async endActiveCall(ctx: RouterContext): Promise<Call> {
    const call = await this.getActiveCall(ctx);
    return await this.endCall(ctx, call.id);
  }

  public async acceptActiveCall(ctx: RouterContext): Promise<Call> {
    const call = await this.getPendingCall(ctx);
    return await this.acceptCall(ctx, call.id);
  }

  public async declineActiveCall(ctx: RouterContext): Promise<Call> {
    const call = await this.getPendingCall(ctx);
    console.log('Trying to decline call', call);
    return await this.declineCall(ctx, call.id);
  }

  public async getCallByPhoneNumber(phoneNumber: string): Promise<Call | null> {
    return this.callRepository.getCallByPhoneNumber(phoneNumber);
  }

  public async createCall(call: InsertCall): Promise<Call> {
    return await this.callRepository.createCall(call);
  }

  public async updateCall(call: Call): Promise<Call> {
    return await this.callRepository.updateCall(call);
  }

  public async deleteCall(callId: string): Promise<void> {
    return this.callRepository.deleteCall(callId);
  }

  public async getCalls(): Promise<Call[]> {
    return this.callRepository.getCalls();
  }

  public async broadcastCallUpdate(ctx: RouterContext, call: Call): Promise<void> {
    try {
      const callerSrc = await getPlayerSrcBySid(call.caller_id);
      const receiverSrc = await getPlayerSrcBySid(call.receiver_id);

      if (call.ended_at || call.declined_at) {
        ctx.emitToNui(callerSrc, 'active-call:updated', null);
        ctx.emitToNui(receiverSrc, 'active-call:updated', null);
        return;
      }

      ctx.emitToNui(callerSrc, 'active-call:updated', parseObjectToIsoString(call));
      ctx.emitToNui(receiverSrc, 'active-call:updated', parseObjectToIsoString(call));
    } catch (error) {
      console.error('Failed to broadcast call update', error);
      handleError(error, ctx);
    }
  }
}

export default new CallService(CallRepository, SimCardRepository, DeviceRepository);
