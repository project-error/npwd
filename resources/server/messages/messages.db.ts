import DbInterface from '../db/db_wrapper';
import {
  CreateMessageDTO,
  Message,
  MessageConversation,
  MessagesRequest,
} from '../../../typings/messages';
import { ResultSetHeader } from 'mysql2';

const MESSAGES_PER_PAGE = 20;

export class _MessagesDB {
  async getConversations(phoneNumber: string): Promise<MessageConversation[]> {
    const query = `SELECT npwd_messages_conversations.id,
                          npwd_messages_conversations.conversation_list as conversationList,
                          npwd_messages_participants.unread_count       as unreadCount,
                          npwd_messages_conversations.is_group_chat     as isGroupChat,
                          npwd_messages_conversations.label,
                          npwd_messages_participants.participant
                   FROM npwd_messages_conversations
                            INNER JOIN npwd_messages_participants
                                       on npwd_messages_conversations.id = npwd_messages_participants.conversation_id
                   WHERE npwd_messages_participants.participant = ?`;

    const [results] = await DbInterface._rawExec(query, [phoneNumber]);

    return <MessageConversation[]>results;
  }

  async getMessages(dto: MessagesRequest): Promise<Message[]> {
    const offset = MESSAGES_PER_PAGE * dto.page;

    const query = `SELECT npwd_messages.id,
                          npwd_messages.conversation_id,
                          npwd_messages.author,
                          npwd_messages.message,
                          npwd_messages.is_embed,
                          npwd_messages.embed
                   FROM npwd_messages
                   WHERE conversation_id = ?
                   ORDER BY id
                   LIMIT ? OFFSET ?`;

    const [results] = await DbInterface._rawExec(query, [
      dto.conversationId,
      MESSAGES_PER_PAGE,
      offset,
    ]);
    return <Message[]>results;
  }

  async createConversation(
    participants: string[],
    conversationList: string,
    conversationLabel: string,
    isGroupChat: boolean,
  ) {
    const conversationQuery = `INSERT INTO npwd_messages_conversations (conversation_list, label, is_group_chat)
                               VALUES (?, ?, ?)`;
    const participantQuery = `INSERT INTO npwd_messages_participants (conversation_id, participant)
                              VALUES (?, ?)`;

    const [results] = await DbInterface._rawExec(conversationQuery, [
      conversationList,
      isGroupChat ? conversationLabel : '',
      isGroupChat,
    ]);
    const result = <ResultSetHeader>results;

    const conversationId = result.insertId;

    for (const participant of participants) {
      await DbInterface._rawExec(participantQuery, [conversationId, participant]);
    }

    return conversationId;
  }

  async addParticipantToConversation(conversationList: string, phoneNumber: string) {
    const conversationId = await this.getConversationId(conversationList);

    const participantQuery = `INSERT INTO npwd_messages_participants (conversation_id, participant)
                              VALUES (?, ?)`;

    await DbInterface._rawExec(participantQuery, [conversationId, phoneNumber]);

    return conversationId;
  }

  async createMessage(dto: CreateMessageDTO) {
    const query = `INSERT INTO npwd_messages (message, user_identifier, conversation_id, author, is_embed, embed)
                   VALUES (?, ?, ?, ?, ?, ?)`;

    const [results] = await DbInterface._rawExec(query, [
      dto.message || '',
      dto.userIdentifier,
      dto.conversationId,
      dto.authorPhoneNumber,
      dto.is_embed || false,
      dto.embed || '',
    ]);

    const result = <ResultSetHeader>results;

    return result.insertId;
  }

  async setMessageUnread(conversationId: number, tgtPhoneNumber: string) {
    const query = `UPDATE npwd_messages_participants
                   SET unread_count = unread_count + 1
                   WHERE conversation_id = ?
                     AND participant = ?`;

    await DbInterface._rawExec(query, [conversationId, tgtPhoneNumber]);
  }

  async setMessageRead(conversationId: number, participantNumber: string) {
    const query = `UPDATE npwd_messages_participants
                   SET unread_count = 0
                   WHERE conversation_id = ?
                     AND participant = ?`;

    await DbInterface._rawExec(query, [conversationId, participantNumber]);
  }

  async deleteMessage(message: Message) {
    const query = `DELETE
                   FROM npwd_messages
                   WHERE id = ?`;

    await DbInterface._rawExec(query, [message.id]);
  }

  async deleteConversation(conversationId: number, phoneNumber: string) {
    const query = `DELETE
                   FROM npwd_messages_participants
                   WHERE conversation_id = ?
                     AND participant = ?`;

    await DbInterface._rawExec(query, [conversationId, phoneNumber]);
  }

  async doesConversationExist(conversationList: string): Promise<boolean> {
    const query = `SELECT COUNT(*) as count
                   FROM npwd_messages_conversations
                            INNER JOIN npwd_messages_participants
                                       on npwd_messages_conversations.id = npwd_messages_participants.conversation_id
                   WHERE conversation_list = ?`;

    const [results] = await DbInterface._rawExec(query, [conversationList]);
    const result = <any>results;
    const count = result[0].count;

    return count > 0;
  }

  async doesConversationExistForPlayer(
    conversationList: string,
    phoneNumber: string,
  ): Promise<boolean> {
    const query = `SELECT COUNT(*) as count
                   FROM npwd_messages_conversations
                            INNER JOIN npwd_messages_participants
                                       on npwd_messages_conversations.id = npwd_messages_participants.conversation_id
                   WHERE conversation_list = ?
                     AND npwd_messages_participants.participant = ?`;

    const [results] = await DbInterface._rawExec(query, [conversationList, phoneNumber]);
    const result = <any>results;
    const count = result[0].count;

    return count > 0;
  }

  // misc stuff
  async getConversationId(conversationList: string): Promise<number> {
    const query = `SELECT id
                   FROM npwd_messages_conversations
                   WHERE conversation_list = ?`;

    const [results] = await DbInterface._rawExec(query, [conversationList]);
    const result = <any>results;

    return result[0].id;
  }
}

const MessagesDB = new _MessagesDB();

export default MessagesDB;
