import DbInterface from '../db/db_wrapper';
import {
  ChannelItemProps,
  ChannelMember,
  ChannelMessageProps,
  RawChannelMessageProps,
  UpdateLabelDto,
} from '../../../typings/darkchat';
import { ResultSetHeader } from 'mysql2';
import PlayerService from '../players/player.service';

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

    const channels = <ChannelItemProps[]>results;

    return Promise.all(
      channels.map(async (channel) => {
        const owner = await this.getChannelOwner(channel.id);
        const ownerPhoneNumber = await PlayerService.getPhoneNumberFromIdentifier(owner);

        return {
          ...channel,
          owner: ownerPhoneNumber,
        };
      }),
    );
  }

  /*
   * Returns the identifier of the channel owner
   * */
  async getChannelOwner(channelId: number): Promise<string> {
    const query = `SELECT user_identifier
                   FROM darkchat_channel_members
                   WHERE channel_id = ?
                     AND is_owner = 1`;

    const [results] = await DbInterface._rawExec(query, [channelId]);
    const result = <any[]>results;
    console.log('GET CHANNEL OWNER', result[0]);

    return result[0].user_identifier;
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

  async getChannelIdAndLabel(channelIdentifier: string): Promise<{ id: number; label: string }> {
    const query = `SELECT id, label
                   FROM darkchat_channels
                   WHERE channel_identifier = ?`;
    const [results] = await DbInterface._rawExec(query, [channelIdentifier]);

    const result = <any[]>results;
    return { id: result[0].id, label: result[0].label };
  }

  async joinChannel(
    channelIdentifier: string,
    userIdentifier: string,
    isOwner: boolean,
  ): Promise<number> {
    const { id: channelId } = await this.getChannelIdAndLabel(channelIdentifier);

    const query = `INSERT INTO darkchat_channel_members (channel_id, user_identifier, is_owner)
                   VALUES (?, ?, ?)`;

    await DbInterface._rawExec(query, [channelId, userIdentifier, isOwner]);

    return channelId;
  }

  async createChannel(channelIdentifier: string): Promise<number> {
    const query = `INSERT INTO darkchat_channels (channel_identifier, label)
                   VALUES (?, ?)`;
    const [results] = await DbInterface._rawExec(query, [channelIdentifier, channelIdentifier]);

    const result = <ResultSetHeader>results;

    return result.insertId;
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
                          user_identifier AS identifier,
                          is_owner        AS isOwner
                   FROM darkchat_channel_members
                   WHERE channel_id = ?`;

    const [results] = await DbInterface._rawExec(query, [channelId]);
    return <ChannelMember[]>results;
  }

  async leaveChannel(channelId: number, userIdentifier: string): Promise<void> {
    const query = `DELETE
                   FROM darkchat_channel_members
                   WHERE channel_id = ?
                     AND user_identifier = ?`;

    await DbInterface._rawExec(query, [channelId, userIdentifier]);
  }

  async updateChannelLabel(dto: UpdateLabelDto): Promise<void> {
    const query = `UPDATE darkchat_channels
                   SET label = ?
                   WHERE id = ?`;

    await DbInterface._rawExec(query, [dto.label, dto.channelId]);
  }
}

const DarkchatDB = new _DarkchatDB();
export default DarkchatDB;
