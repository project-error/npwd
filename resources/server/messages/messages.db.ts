import { pool } from '../db';
import { Message, UnformattedMessageConversation } from '../../../typings/messages';
import { config } from '../server';
import DbInterface from '../db/db_wrapper';

export class _MessagesDB {
  /**
   * Create a message in the database
   * @param userIdentifier - identifier of the user creating this message
   * @param conversationId - the message conversation ID to attach this message to
   * @param message - content of the message
   */
  async createMessage(
    userIdentifier: string,
    conversationId: string,
    message: string,
  ): Promise<UnformattedMessageConversation[]> {
    const query = `INSERT INTO npwd_messages (user_identifier, message, conversation_id)
                   VALUES (?, ?, ?)`;

    const [results] = await pool.query(query, [userIdentifier, message, conversationId]);

    return <UnformattedMessageConversation[]>results;
  }

  // Not sure if we're going to query this exactly as its done here.
  /**
   * Retrieve all message conversations associated with a user. This will
   * populate the list of message conversations on the UI
   * @param identifier - identifier of the user to get message conversations for
   */
  async getMessageConversations(identifier: string): Promise<UnformattedMessageConversation[]> {
    const query = `SELECT npwd_messages_conversations.unread,
                          npwd_messages_conversations.conversation_id,
                          users.phone_number,
                          npwd_phone_contacts.avatar,
                          npwd_phone_contacts.display
                   FROM (SELECT conversation_id
                         FROM npwd_messages_conversations
                         WHERE npwd_messages_conversations.participant_identifier = ?) AS t
                            LEFT OUTER JOIN npwd_messages_conversations
                                            ON npwd_messages_conversations.conversation_id = t.conversation_id
                            LEFT OUTER JOIN users
                                            ON users.identifier = npwd_messages_conversations.participant_identifier
                            LEFT OUTER JOIN npwd_phone_contacts
                                            ON REGEXP_REPLACE(npwd_phone_contacts.number, '[^0-9]', '') =
                                               REGEXP_REPLACE(users.phone_number, '[^0-9]', '')
                                                AND npwd_phone_contacts.identifier = ?`;

    const [results] = await pool.query(query, [identifier, identifier]);
    return <UnformattedMessageConversation[]>results;
  }

  /**
   * @param identifier user to get messages for
   * @param conversationId the conversations for get messages from
   */
  async getMessages(identifier: string, conversationId: string): Promise<Message[]> {
    const query = `
        SELECT npwd_messages.id
                   AS
                   message_id,
               npwd_messages.message,
               npwd_messages.isRead,
               npwd_messages.createdAt,
               npwd_messages.visible,
               npwd_messages_conversations.id
                   AS
                   conversation_id,
               npwd_messages_conversations.user_identifier
                   AS
                   owner,
               npwd_messages_conversations.unread,
               npwd_messages_conversations.participant_identifier
                   AS
                   participant,
               npwd_messages.user_identifier
                   AS
                   transmitter
        FROM npwd_messages
                 INNER JOIN
             npwd_messages_conversations
             ON
                 npwd_messages.conversation_id = npwd_messages_conversations.id
        WHERE npwd_messages_conversations.user_identifier = ?
           OR npwd_messages_conversations.participant_identifier = ? AND npwd_messages_conversations.id = ? `;

    const [results] = await pool.query(query, [identifier, identifier, conversationId]);

    return <Message[]>results;
  }

  /**
   * Create a message group
   * @param userIdentifier - the user creating the message group
   * @param conversationId - the unique group ID this corresponds to
   * @param participantIdentifier - the participant user identifier. This identifier is what attaches
   * other players to the message group
   */
  async createMessageGroup(
    userIdentifier: string,
    conversationId: string,
    participantIdentifier: string,
  ): Promise<void> {
    const query = `
        INSERT
        INTO npwd_messages_conversations
            (user_identifier, conversation_id, participant_identifier)
        VALUES (?, ?, ?)
		`;
    await pool.query(query, [userIdentifier, conversationId, participantIdentifier]);
  }

  /**
   * Find a players identifier from their phone number
   * @param phoneNumber - the phone number to search for
   */
  async getIdentifierFromPhoneNumber(phoneNumber: string): Promise<string> {
    const query = `
        SELECT ${config.database.identifierColumn}
        FROM ${config.database.playerTable}
        WHERE REGEXP_REPLACE(phone_number, '[^0-9]', '') = ?
        LIMIT 1
		`;
    const [results] = await pool.query(query, [phoneNumber]);
    const identifiers = <any>results;
    return identifiers[0]['identifier'];
  }

  /**
   * This method checks if the input groupId already exists in
   * the database. As long as the groupId is derived from the input
   * identifiers this means that the user is trying to create a
   * duplicate!
   * @param groupId - group Id to check that it exists
   */
  async checkIfMessageGroupExists(groupId: string): Promise<boolean> {
    const query = `
      SELECT COUNT(*) as count
      FROM npwd_messages_groups
      WHERE group_id = ?;
    `;
    const [results] = await DbInterface._rawExec(query, [groupId]);
    const result = <any>results;
    const count = result[0].count;
    return count > 0;
  }

  async getMessageCountByGroup(groupId: string): Promise<number> {
    const query = `
        SELECT COUNT(*) as count FROM npwd_messages WHERE conversation_id = ?`;
    const [results] = await pool.query(query, [groupId]);
    const result = <any>results;
    return result[0].count;
  }

  /**
   * Sets the current message isRead to 0 for said player
   * @param groupId The unique group ID for the message
   * @param identifier The identifier for the player
   */
  async setMessageRead(groupId: string, identifier: string) {
    const query = `UPDATE npwd_messages_groups SET unreadCount = 0 WHERE group_id = ? AND participant_identifier = ?`;
    await DbInterface._rawExec(query, [groupId, identifier]);
  }
}

const MessagesDB = new _MessagesDB();

export default MessagesDB;
