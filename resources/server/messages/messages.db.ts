import { pool } from '../db';
import { UnformattedMessageGroup, Message } from '../../../typings/messages';
import { config } from '../server';

export class _MessagesDB {
  /**
   * Create a message in the database
   * @param userIdentifier - identifier of the user creating this message
   * @param groupId - the message group ID to attach this message to
   * @param message - content of the message
   * @param participants -
   */
  async createMessage(
    userIdentifier: string,
    groupId: string,
    message: string,
    participants: string[],
  ): Promise<UnformattedMessageGroup[]> {
    const query = `INSERT INTO npwd_messages (user_identifier, message, group_id) VALUES (?, ?, ?)`;

    const groupQuery = `
      UPDATE npwd_messages_groups SET unreadCount = unreadCount + 1 WHERE participant_identifier = ? AND group_id = ?
    `;
    const [results] = await pool.query(query, [userIdentifier, message, groupId]);

    await Promise.all(
      participants
        .filter((s) => userIdentifier !== s)
        .map((s) => pool.query(groupQuery, [s, groupId])),
    );

    return <UnformattedMessageGroup[]>results;
  }

  /**
   * Retrieve all message groups associated with a user. This will
   * populate the list of message groups on the UI
   * @param userIdentifier - identifier of the user to get message groups for
   */
  async getMessageGroups(userIdentifier: string): Promise<UnformattedMessageGroup[]> {
    const query = `
    SELECT
      npwd_messages_groups.unreadCount,
      npwd_messages_groups.group_id,
      npwd_messages_groups.participant_identifier,
      npwd_messages_groups.user_identifier,
      npwd_messages_labels.label,
      ${config.database.playerTable}.phone_number,
      npwd_phone_contacts.avatar,
      npwd_phone_contacts.display
    FROM (
      SELECT group_id
      FROM npwd_messages_groups
      WHERE npwd_messages_groups.participant_identifier = ?
    ) as t
    LEFT OUTER JOIN npwd_messages_groups on npwd_messages_groups.group_id = t.group_id
    LEFT OUTER JOIN ${config.database.playerTable} on ${config.database.playerTable}.${config.database.identifierColumn} = npwd_messages_groups.participant_identifier
    LEFT OUTER JOIN npwd_messages_labels on npwd_messages_labels.group_id = npwd_messages_groups.group_id
    LEFT OUTER JOIN npwd_phone_contacts on REGEXP_REPLACE(npwd_phone_contacts.number, '[^0-9]', '') = REGEXP_REPLACE(${config.database.playerTable}.phone_number, '[^0-9]', '') AND npwd_phone_contacts.identifier = ?
    ORDER BY npwd_messages_groups.createdAt DESC
    `;

    const [results] = await pool.query(query, [userIdentifier, userIdentifier, userIdentifier]);
    return <UnformattedMessageGroup[]>results;
  }

  /**
   * Retrieve all messages associated with a group and add a field
   * "isMine" which determines if the message belongs to the user
   * making the request
   * @param userIdentifier - user to get messages for
   * @param groupId - the group to get messages from
   */
  async getMessages(userIdentifier: string, groupId: string): Promise<Message[]> {
    const query = `
    SELECT
      npwd_messages.id,
      npwd_messages.message,
      npwd_messages.group_id,
      npwd_messages.user_identifier,
      npwd_messages.isRead,
      npwd_messages.updatedAt,
      ${config.database.playerTable}.phone_number,
      npwd_phone_contacts.display,
      npwd_phone_contacts.avatar
    FROM npwd_messages
    LEFT OUTER JOIN ${config.database.playerTable} on ${config.database.playerTable}.${config.database.identifierColumn} = npwd_messages.user_identifier
    LEFT OUTER JOIN npwd_phone_contacts on REGEXP_REPLACE(npwd_phone_contacts.number, '[^0-9]', '') = REGEXP_REPLACE(${config.database.playerTable}.phone_number, '[^0-9]', '') AND npwd_phone_contacts.identifier = ?
    WHERE npwd_messages.group_id = ?
    ORDER BY createdAt ASC;
    `;

    const [results] = await pool.query(query, [userIdentifier, groupId]);
    const messages = <Message[]>results;
    return messages.map((message) => ({
      ...message,
      isMine: message.user_identifier == userIdentifier,
      updatedAt: message.updatedAt.toString(),
    }));
  }

  /**
   * Create a message group label
   * @param userIdentifier - user who is creating the message group
   * @param groupId - groupId this label is attached to
   * @param label - the label itself
   */
  async createLabel(userIdentifier: string, groupId: string, label: string): Promise<void> {
    const query = `
    INSERT INTO npwd_messages_labels
    (user_identifier, group_id, label)
    VALUES (?, ?, ?)
    `;
    await pool.query(query, [userIdentifier, groupId, label]);
  }

  /**
   * Create a message group
   * @param userIdentifier - the user creating the message group
   * @param groupId - the unique group ID this corresponds to
   * @param participantIdentifier - the participant user identifier. This identifier is what attaches
   * other players to the message group
   */
  async createMessageGroup(
    userIdentifier: string,
    groupId: string,
    participantIdentifier: string,
  ): Promise<void> {
    const query = `
    INSERT INTO npwd_messages_groups
    (user_identifier, group_id, participant_identifier)
    VALUES (?, ?, ?)
    `;
    await pool.query(query, [userIdentifier, groupId, participantIdentifier]);
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
    const [results] = await pool.query(query, [groupId]);
    const result = <any>results;
    const count = result[0].count;
    return count > 0;
  }

  async getMessageCountByGroup(groupId: string): Promise<number> {
    const query = `
      SELECT COUNT(*) as count
      FROM npwd_messages
      WHERE group_id = ?;
    `;
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
    await pool.query(query, [groupId, identifier]);
  }
}

const MessagesDB = new _MessagesDB();

export default MessagesDB;
