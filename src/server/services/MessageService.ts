import { RouterContext } from 'fivem-router';
import MessageRepository from '../repositories/MessageRepository';
import SimCardRepository from '../repositories/SimCardRepository';
import {
  MessageNotFoundError,
  SimCardNotActiveError,
  SimcardNotFoundError,
  UnauthorizedError,
} from '../../shared/Errors';
import DeviceRepository from '../repositories/DeviceRepository';
import { Message } from '../../shared/Types';
import { handleError } from '../utils/errors';
import BroadcastService from './BroadcastService';

class MessageService {
  private readonly messageRepository: typeof MessageRepository;
  private readonly simCardRepository: typeof SimCardRepository;
  private readonly deviceRepository: typeof DeviceRepository;

  constructor(
    messageRepository: typeof MessageRepository,
    simCardRepository: typeof SimCardRepository,
    deviceRepository: typeof DeviceRepository,
  ) {
    this.messageRepository = messageRepository;
    this.simCardRepository = simCardRepository;
    this.deviceRepository = deviceRepository;
  }

  public async sendMessage(
    ctx: RouterContext,
    content: string,
    receiverPhoneNumber: string,
  ): Promise<Message> {
    if (!ctx.device.sim_card_id) {
      throw new SimcardNotFoundError('SENDER');
    }

    if (!ctx.device.sim_card_is_active) {
      throw new SimCardNotActiveError('SENDER');
    }

    const receiverSimcard = await this.simCardRepository.getSimCardByPhoneNumber(
      receiverPhoneNumber,
    );

    if (!receiverSimcard) {
      throw new SimcardNotFoundError('RECEIVER');
    }

    if (!receiverSimcard.is_active) {
      throw new SimCardNotActiveError('RECEIVER');
    }

    const message = await this.messageRepository.createMessage({
      sender_id: ctx.device.sim_card_id,
      receiver_id: receiverSimcard.id,
      content,
    });

    this.broadcastNewMessage(ctx, message);

    return message;
  }

  public async broadcastNewMessage(ctx: RouterContext, message: Message): Promise<void> {
    try {
      BroadcastService.emitToNuis({
        ctx,
        data: message,
        event: 'message:new-message',
        sidList: [message.sender_id, message.receiver_id],
      });
    } catch (error) {
      console.error('Failed to broadcast call update', error);
      handleError(error, ctx);
    }
  }

  public async getMessages(ctx: RouterContext): Promise<Message[]> {
    const device = await this.deviceRepository.getDeviceById(ctx.device.id);

    if (!device) {
      throw new SimcardNotFoundError('SENDER');
    }

    if (!device.sim_card_id) {
      throw new SimcardNotFoundError('SENDER');
    }

    const messages = await this.messageRepository.getMessagesBySid(device.sim_card_id);

    return messages;
  }

  public async getMessageById(ctx: RouterContext, messageId: number): Promise<Message | null> {
    const message = await this.messageRepository.getMessageById(messageId);

    if (!message) {
      throw new MessageNotFoundError();
    }

    if (
      message.sender_id !== ctx.device.sim_card_id &&
      message.receiver_id !== ctx.device.sim_card_id
    ) {
      throw new UnauthorizedError();
    }

    return message;
  }

  public async getConversation(ctx: RouterContext, phoneNumber: string): Promise<Message[]> {
    const device = await this.deviceRepository.getDeviceById(ctx.device.id);

    if (!device) {
      throw new SimcardNotFoundError('SENDER');
    }

    if (!device.sim_card_id) {
      throw new SimcardNotFoundError('SENDER');
    }

    const receiverSimcard = await this.simCardRepository.getSimCardByPhoneNumber(phoneNumber);

    if (!receiverSimcard) {
      throw new SimcardNotFoundError('RECEIVER');
    }

    if (!receiverSimcard.is_active) {
      throw new SimCardNotActiveError('RECEIVER');
    }

    const messages = await this.messageRepository.getConversation(
      device.sim_card_id,
      receiverSimcard.id,
    );

    return messages;
  }

  public async updateMessage(
    ctx: RouterContext,
    messageId: number,
    content: string,
  ): Promise<Message> {
    const message = await this.getMessageById(ctx, messageId);

    if (!message) {
      throw new MessageNotFoundError();
    }

    if (message.sender_id !== ctx.device.sim_card_id) {
      throw new UnauthorizedError();
    }

    message.content = content;
    return await this.messageRepository.updateMessage(message);
  }

  public async deleteMessage(ctx: RouterContext, messageId: number): Promise<void> {
    const message = await this.getMessageById(ctx, messageId);

    if (!message) {
      throw new MessageNotFoundError();
    }

    if (message.sender_id !== ctx.device.sim_card_id) {
      throw new UnauthorizedError();
    }

    await this.messageRepository.deleteMessage(messageId);
  }
}

export default new MessageService(MessageRepository, SimCardRepository, DeviceRepository);
