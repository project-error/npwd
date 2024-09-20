import { InsertMessage, Message, MessageWithPhoneNumbers } from '../../shared/Types';
import { DBInstance } from '../database/knex';

const tableName = 'tmp_phone_message';

class MessageRepository {
  public async getMessages(): Promise<Message[]> {
    return await DBInstance(tableName);
  }

  public async getMessageById(messageId: number): Promise<Message | null> {
    return await DBInstance(tableName).where('id', messageId).first();
  }

  public async getMessagesBySid(sid: number): Promise<MessageWithPhoneNumbers[]> {
    return await DBInstance(tableName)
      .leftJoin('tmp_phone_sim_card as sender', 'sender.id', 'tmp_phone_message.sender_id')
      .leftJoin('tmp_phone_sim_card as receiver', 'receiver.id', 'tmp_phone_message.receiver_id')
      .select(
        'tmp_phone_message.*',
        'sender.phone_number as sender_phone_number',
        'receiver.phone_number as receiver_phone_number',
      )
      .where('sender_id', sid)
      .orWhere('receiver_id', sid)
      .orderBy('tmp_phone_message.created_at', 'desc');
  }

  public async getMessagesBySenderId(senderId: number): Promise<Message[]> {
    return await DBInstance(tableName).where('sender_id', senderId).orderBy('created_at', 'desc');
  }

  public async getMessagesByReceiverId(receiverId: number): Promise<Message[]> {
    return await DBInstance(tableName)
      .where('receiver_id', receiverId)
      .orderBy('created_at', 'desc');
  }

  public async getConversation(senderId: number, receiverId: number): Promise<Message[]> {
    return await DBInstance(tableName)
      .where('sender_id', senderId)
      .andWhere('receiver_id', receiverId)
      .orWhere('sender_id', receiverId)
      .andWhere('receiver_id', senderId)
      .orderBy('created_at', 'asc');
  }

  public async createMessage(message: InsertMessage): Promise<MessageWithPhoneNumbers> {
    const [newId] = await DBInstance(tableName).insert(message);
    return await DBInstance(tableName)
      .select('*')
      .where(`${tableName}.id`, newId)
      .leftJoin('tmp_phone_sim_card as sender', 'sender.id', 'tmp_phone_message.sender_id')
      .leftJoin('tmp_phone_sim_card as receiver', 'receiver.id', 'tmp_phone_message.receiver_id')
      .select(
        'tmp_phone_message.*',
        'sender.phone_number as sender_phone_number',
        'receiver.phone_number as receiver_phone_number',
      )
      .first();
  }

  public async updateMessage(message: Message): Promise<Message> {
    await DBInstance(tableName).where('id', message.id).update(message);
    return await this.getMessageById(message.id);
  }

  public async deleteMessage(messageId: number): Promise<void> {
    await DBInstance(tableName).where('id', messageId).delete();
  }
}

export default new MessageRepository();
