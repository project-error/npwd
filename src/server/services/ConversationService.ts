import { RouterContext } from 'fivem-router';
import { SimCardNotActiveError, SimcardNotFoundError } from '../../shared/Errors';
import MessageRepository from '../repositories/MessageRepository';
import SimCardRepository from '../repositories/SimCardRepository';
import DeviceRepository from '../repositories/DeviceRepository';
import { MessageWithPhoneNumbers } from '../../shared/Types';

class ConversationService {
  messageRepository: typeof MessageRepository;
  simCardRepository: typeof SimCardRepository;
  deviceRepository: typeof DeviceRepository;

  constructor(
    messageRepository: typeof MessageRepository,
    simCardRepository: typeof SimCardRepository,
    deviceRepository: typeof DeviceRepository,
  ) {
    this.messageRepository = messageRepository;
    this.simCardRepository = simCardRepository;
    this.deviceRepository = deviceRepository;
  }

  async getMyConversations(ctx: RouterContext): Promise<string[]> {
    const messages = await this.messageRepository.getMessagesBySid(ctx.device.sim_card_id);

    const createConversationId = (myNumber: string) => (message: MessageWithPhoneNumbers) => {
      const { sender_phone_number, receiver_phone_number } = message;
      const [first, second] = [sender_phone_number, receiver_phone_number].sort();
      return first === myNumber ? second : first;
    };

    const conversations = messages.map(createConversationId(ctx.device.phone_number));
    const uniqueConversations = Array.from(new Set(conversations));

    return uniqueConversations;
  }

  async getConversation(ctx: RouterContext, phoneNumber: string) {
    const receiverSimcard = await this.simCardRepository.getSimCardByPhoneNumber(phoneNumber);

    if (!receiverSimcard) {
      throw new SimcardNotFoundError('RECEIVER');
    }

    if (!receiverSimcard.is_active) {
      throw new SimCardNotActiveError('RECEIVER');
    }

    return await this.messageRepository.getConversation(ctx.device.sim_card_id, receiverSimcard.id);
  }
}

export default new ConversationService(MessageRepository, SimCardRepository, DeviceRepository);
