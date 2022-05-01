import DbInterface from '../db/db_wrapper';
import {
  ChannelItemProps,
  ChannelMember,
  ChannelMessageProps,
  RawChannelMessageProps,
} from '../../../typings/darkchat';
import { ResultSetHeader } from 'mysql2';

export class _DarkchatDB {
  async getAllChannels(userIdentifier: string): Promise<ChannelItemProps[]> {
    const query = `SELECT darkchat_channels.id,
                          darkchat_channels.channel_identifier AS identifier,
                          darkchat_channels.label
                   FROM darkchat_channels
                            LEFT JOIN darkchat_channel_members
                                      on darkchat_channels.id = darkchat_channel_members.channel_id
                   WHERE darkchat_channel_members.user_identifier = ?`;

    const [results] = await DbInterface._rawExec(query, [userIdentifier]);
    return <ChannelItemProps[]>results;
  }

  // inf scroll
  // TODO: OFFSET * MESSAGES_PER_PAGE + LIMIT
  async getChannelMessages(channelId: number): Promise<ChannelMessageProps[]> {
    const query = `SELECT id,
                          message,
                          user_identifier           AS identifier,
                          UNIX_TIMESTAMP(createdAt) as createdAt
                   FROM darkchat_messages
                   WHERE darkchat_messages.channel_id = ?`;

    const [results] = await DbInterface._rawExec(query, [channelId]);
    return <ChannelMessageProps[]>results;
  }

  async getChannelId(channelIdentifier: string): Promise<number> {
    const query = `SELECT id
                   FROM darkchat_channels
                   WHERE channel_identifier = ?`;
    const [results] = await DbInterface._rawExec(query, [channelIdentifier]);

    const result = <any[]>results;
    return result[0].id;
  }

  async joinChannel(channelIdentifier: string, userIdentifier: string): Promise<number> {
    const channelId = await this.getChannelId(channelIdentifier);

    const query = `INSERT INTO darkchat_channel_members (channel_id, user_identifier)
                   VALUES (?, ?)`;

    const [results] = await DbInterface._rawExec(query, [channelId, userIdentifier]);
    const result = <ResultSetHeader>results;

    return result.insertId;
  }

  async createChannel(channelIdentifier: string, label?: string): Promise<void> {
    const query = `INSERT INTO darkchat_channels (channel_identifier, label)
                   VALUES (?, ?)`;
    await DbInterface._rawExec(query, [channelIdentifier, label || '']);
  }

  async doesChannelExist(channelIdentifier: string): Promise<boolean> {
    const query = `SELECT *
                   FROM darkchat_channels
                   WHERE channel_identifier = ?`;

    const [results] = await DbInterface._rawExec(query, [channelIdentifier]);

    const result = <any[]>results;
    return result.length > 0;
  }

  async getMessage(channelId: number, messageId: number): Promise<ChannelMessageProps> {
    const query = `SELECT id,
                          message,
                          user_identifier           AS identifier,
                          UNIX_TIMESTAMP(createdAt) as createdAt
                   FROM darkchat_messages
                   WHERE channel_id = ?
                     AND id = ?`;

    const [results] = await DbInterface._rawExec(query, [channelId, messageId]);
    const result = <ChannelMessageProps[]>results;
    return result[0];
  }

  async createMessage(
    channelId: number,
    userIdentifier: string,
    message: string,
  ): Promise<ChannelMessageProps> {
    const query = `INSERT INTO darkchat_messages (channel_id, message, user_identifier)
                   VALUES (?, ?, ?)`;

    const [results] = await DbInterface._rawExec(query, [channelId, message, userIdentifier]);
    const result = <ResultSetHeader>results;

    return await this.getMessage(channelId, result.insertId);
  }

  async getChannelMembers(channelId: number): Promise<ChannelMember[]> {
    const query = `SELECT channel_id      AS channelId,
                          user_identifier AS identifier
                   FROM darkchat_channel_members
                   WHERE channel_id = ?`;

    const [results] = await DbInterface._rawExec(query, [channelId]);
    return <ChannelMember[]>results;
  }
}

const DarkchatDB = new _DarkchatDB();
export default DarkchatDB;
