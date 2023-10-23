import { DbInterface } from '../db';
import {
  ChannelItemProps,
  ChannelMember,
  ChannelMessageProps,
  UpdateLabelDto,
} from '@typings/darkchat';
import { ResultSetHeader } from 'mysql2';
import PlayerService from '@game/server/players/player.service';

export class _DarkchatDB {
  async getAllChannels(userIdentifier: string): Promise<ChannelItemProps[]> {
    const query = `SELECT npwd_darkchat_channels.id,
                          npwd_darkchat_channels.channel_identifier AS identifier,
                          npwd_darkchat_channels.label
                   FROM npwd_darkchat_channels
                            LEFT JOIN npwd_darkchat_channel_members
                                      on npwd_darkchat_channels.id = npwd_darkchat_channel_members.channel_id
                   WHERE npwd_darkchat_channel_members.user_identifier = ?`;

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

  async getMembers(channelId: number): Promise<ChannelMember[]> {
    const query = `SELECT npwd_darkchat_channel_members.channel_id      AS channelId,
                          npwd_darkchat_channel_members.is_owner        AS isOwner,
                          npwd_darkchat_channel_members.user_identifier AS identifier
                   FROM npwd_darkchat_channel_members
                   WHERE channel_id = ?`;

    const [results] = await DbInterface._rawExec(query, [channelId]);
    const members = <ChannelMember[]>results;

    return Promise.all(
      members.map(async (member) => {
        const player = await PlayerService.getPlayerFromIdentifier(member.identifier);
        
        return {
          ...member,
          phoneNumber: (player ? player.getPhoneNumber() : ""),
        };
      }),
    );
  }

  async transferChannelOwnership(
    oldOwnerIdentifier: string,
    newOwnerIdentifier: string,
    channelId: number,
  ) {
    const query = `UPDATE npwd_darkchat_channel_members
                   SET is_owner = ?
                   WHERE user_identifier = ?
                     AND channel_id = ?`;

    await DbInterface._rawExec(query, [0, oldOwnerIdentifier, channelId]);
    await DbInterface._rawExec(query, [1, newOwnerIdentifier, channelId]);
  }

  /*
   * Returns the identifier of the channel owner
   * */
  async getChannelOwner(channelId: number): Promise<string> {
    const query = `SELECT user_identifier
                   FROM npwd_darkchat_channel_members
                   WHERE channel_id = ?
                     AND is_owner = 1`;

    const [results] = await DbInterface._rawExec(query, [channelId]);
    const result = <any[]>results;

    return result[0].user_identifier;
  }

  // inf scroll
  // TODO: OFFSET * MESSAGES_PER_PAGE + LIMIT
  async getChannelMessages(channelId: number): Promise<ChannelMessageProps[]> {
    const query = `SELECT id,
                          message,
                          user_identifier           AS identifier,
                          UNIX_TIMESTAMP(createdAt) AS createdAt,
                          is_image                  AS isImage 
                   FROM npwd_darkchat_messages
                   WHERE npwd_darkchat_messages.channel_id = ?`;

    const [results] = await DbInterface._rawExec(query, [channelId]);
    return <ChannelMessageProps[]>results;
  }

  async getChannelIdAndLabel(channelIdentifier: string): Promise<{ id: number; label: string }> {
    const query = `SELECT id, label
                   FROM npwd_darkchat_channels
                   WHERE channel_identifier = ?`;
    const [results] = await DbInterface._rawExec(query, [channelIdentifier]);

    const result = <any[]>results;
    return { id: result[0].id, label: result[0].label };
  }

  async joinChannel(channelIdentifier: string, userIdentifier: string, isOwner: boolean): Promise<number> {
    const { id: channelId } = await this.getChannelIdAndLabel(channelIdentifier);

    const query = `INSERT INTO npwd_darkchat_channel_members (channel_id, user_identifier, is_owner)
                   VALUES (?, ?, ?)`;

    await DbInterface._rawExec(query, [channelId, userIdentifier, isOwner]);

    return channelId;
  }

  async createChannel(channelIdentifier: string): Promise<number> {
    const query = `INSERT INTO npwd_darkchat_channels (channel_identifier, label)
                   VALUES (?, ?)`;
    const [results] = await DbInterface._rawExec(query, [channelIdentifier, channelIdentifier]);

    const result = <ResultSetHeader>results;

    return result.insertId;
  }

  async doesChannelExist(channelIdentifier: string): Promise<boolean> {
    const query = `SELECT *
                   FROM npwd_darkchat_channels
                   WHERE channel_identifier = ?`;

    const [results] = await DbInterface._rawExec(query, [channelIdentifier]);

    const result = <any[]>results;
    return result.length > 0;
  }

  async getMessage(channelId: number, messageId: number): Promise<ChannelMessageProps> {
    const query = `SELECT id,
                          message,
                          user_identifier           AS identifier,
                          UNIX_TIMESTAMP(createdAt) AS createdAt,
                          is_image                  AS isImage 
                   FROM npwd_darkchat_messages
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
    is_image: boolean,
  ): Promise<ChannelMessageProps> {
    const query = `INSERT INTO npwd_darkchat_messages (channel_id, message, user_identifier, is_image)
                   VALUES (?, ?, ?, ?)`;

    const [results] = await DbInterface._rawExec(query, [
      channelId,
      message,
      userIdentifier,
      is_image,
    ]);
    const result = <ResultSetHeader>results;

    return await this.getMessage(channelId, result.insertId);
  }

  async getChannelMembers(channelId: number): Promise<ChannelMember[]> {
    const query = `SELECT channel_id      AS channelId,
                          user_identifier AS identifier,
                          is_owner        AS isOwner
                   FROM npwd_darkchat_channel_members
                   WHERE channel_id = ?`;

    const [results] = await DbInterface._rawExec(query, [channelId]);
    return <ChannelMember[]>results;
  }

  async leaveChannel(channelId: number, userIdentifier: string): Promise<void> {
    const query = `DELETE
                   FROM npwd_darkchat_channel_members
                   WHERE channel_id = ?
                     AND user_identifier = ?`;

    await DbInterface._rawExec(query, [channelId, userIdentifier]);
  }

  async updateChannelLabel(dto: UpdateLabelDto): Promise<void> {
    const query = `UPDATE npwd_darkchat_channels
                   SET label = ?
                   WHERE id = ?`;

    await DbInterface._rawExec(query, [dto.label, dto.channelId]);
  }

  async deleteChannel(channelId: number): Promise<void> {
    const messageQuery = `DELETE FROM npwd_darkchat_messages WHERE channel_id  = ?`;
    const memberQuery = `DELETE FROM npwd_darkchat_channel_members WHERE channel_id = ?`;
    const query = `DELETE
                   FROM npwd_darkchat_channels
                   WHERE id = ?`;

    await DbInterface._rawExec(messageQuery, [channelId]);
    await DbInterface._rawExec(memberQuery, [channelId]);
    await DbInterface._rawExec(query, [channelId]);
  }
}

export const DarkchatDB = new _DarkchatDB();
