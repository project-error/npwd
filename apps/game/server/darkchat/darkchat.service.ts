import DarkchatDB, { _DarkchatDB } from './darkchat.db';
import {
  ChannelItemProps,
  ChannelMember,
  ChannelMessageProps,
  DarkchatEvents,
  JoinChannelDTO,
  MessageDTO,
  OwnerTransferReq,
  OwnerTransferResp,
  UpdateLabelDto,
} from '@typings/darkchat';
import { PromiseEventResp, PromiseRequest } from '../lib/PromiseNetEvents/promise.types';
import PlayerService from '../players/player.service';
import { darkchatLogger } from './darkchat.utils';
import { emitNetTyped } from '../utils/miscUtils';

class _DarkchatService {
  darkchatDB: _DarkchatDB;

  constructor() {
    this.darkchatDB = DarkchatDB;
  }

  async handleGetAllChannels(
    reqObj: PromiseRequest<void>,
    resp: PromiseEventResp<ChannelItemProps[]>,
  ): Promise<void> {
    const identifier = PlayerService.getIdentifier(reqObj.source);
    try {
      const channels = await this.darkchatDB.getAllChannels(identifier);

      resp({ status: 'ok', data: channels });
    } catch (err) {
      darkchatLogger.error(`Failed to fetch channels. Error: ${err.message}`);
      resp({ status: 'error', errorMsg: 'GENERIC_DB_ERROR' });
    }
  }

  async handleGetMembers(
    reqObj: PromiseRequest<{ channelId: number }>,
    resp: PromiseEventResp<ChannelMember[]>,
  ): Promise<void> {
    try {
      const members = await this.darkchatDB.getMembers(reqObj.data.channelId);

      resp({ status: 'ok', data: members });
    } catch (err) {
      darkchatLogger.error(`Failed to fetch members. Error: ${err.message}`);
      resp({ status: 'error', errorMsg: 'GENERIC_DB_ERROR' });
    }
  }

  async handleTransferOwnership(
    reqObj: PromiseRequest<OwnerTransferReq>,
    resp: PromiseEventResp<OwnerTransferResp>,
  ) {
    // the current owner
    const ownerIdentifier = PlayerService.getIdentifier(reqObj.source);
    try {
      await this.darkchatDB.transferChannelOwnership(
        ownerIdentifier,
        reqObj.data.userIdentifier,
        reqObj.data.channelId,
      );

      resp({
        status: 'ok',
        data: {
          ownerPhoneNumber: reqObj.data.newOwnerPhoneNumber,
          channelId: reqObj.data.channelId,
        },
      });

      const newOwnerPlayer = PlayerService.getPlayerFromIdentifier(reqObj.data.userIdentifier);
      if (newOwnerPlayer) {
        emitNetTyped<OwnerTransferResp>(
          DarkchatEvents.TRANSFER_OWNERSHIP_SUCCESS,
          {
            ownerPhoneNumber: reqObj.data.newOwnerPhoneNumber,
            channelId: reqObj.data.channelId,
          },
          newOwnerPlayer.source,
        );
      }
    } catch (err) {
      darkchatLogger.error(`Failed to transfer ownership. Error: ${err.message}`);
      resp({ status: 'error', errorMsg: 'GENERIC_DB_ERROR' });
    }
  }

  async handleGetChannelMessage(
    reqObj: PromiseRequest<{ channelId: number }>,
    resp: PromiseEventResp<ChannelMessageProps[]>,
  ): Promise<void> {
    const identifier = PlayerService.getIdentifier(reqObj.source);
    try {
      const rawMessages = await this.darkchatDB.getChannelMessages(reqObj.data.channelId);
      const mappedMessages = rawMessages.map((msg) => {
        if (msg.identifier === identifier) {
          return {
            ...msg,
            isMine: true,
            type: (msg.type && 'image') || 'text',
          };
        }

        return msg;
      });

      resp({ status: 'ok', data: mappedMessages });
    } catch (err) {
      darkchatLogger.error(`Failed to fetch channel messages. Error: ${err.message}`);
      resp({ status: 'error', errorMsg: err.message });
    }
  }

  // TODO: When we join channel, we'll have to check if exists, and if there are a current owner of the channel.
  // TODO: If not, we'll set ourselves as the owner
  async handleJoinChannel(
    reqObj: PromiseRequest<JoinChannelDTO>,
    resp: PromiseEventResp<ChannelItemProps>,
  ): Promise<void> {
    const identifier = PlayerService.getIdentifier(reqObj.source);
    try {
      const channelExists = await this.darkchatDB.doesChannelExist(reqObj.data.channelIdentifier);
      let isPlayerOwner = false;

      if (!channelExists) {
        await this.darkchatDB.createChannel(reqObj.data.channelIdentifier);
        isPlayerOwner = true;
      }

      const { id, label } = await this.darkchatDB.getChannelIdAndLabel(
        reqObj.data.channelIdentifier,
      );
      const members = await this.darkchatDB.getChannelMembers(id);

      const hasOwner = members.find((member) => member.isOwner);
      if (!hasOwner) isPlayerOwner = true;

      const channelId = await this.darkchatDB.joinChannel(
        reqObj.data.channelIdentifier,
        identifier,
        isPlayerOwner,
      );

      const channelOwner = await this.darkchatDB.getChannelOwner(id);
      const ownerPhoneNumber = await PlayerService.getPhoneNumberFromIdentifier(channelOwner);

      const resData: ChannelItemProps = {
        id: channelId,
        identifier: reqObj.data.channelIdentifier,
        label: label ?? reqObj.data.channelIdentifier,
        owner: ownerPhoneNumber,
      };

      resp({ status: 'ok', data: resData });
    } catch (err) {
      darkchatLogger.error(`Failed to join channel. Error: ${err.message}`);
      resp({ status: 'error', errorMsg: err.message });
    }
  }

  async handleCreateMessage(
    reqObj: PromiseRequest<MessageDTO>,
    resp: PromiseEventResp<ChannelMessageProps>,
  ) {
    const userIdentifier = PlayerService.getIdentifier(reqObj.source);
    const phoneNumber = PlayerService.getPlayer(reqObj.source).getPhoneNumber();
    const messageData = reqObj.data;
    try {
      const message = await this.darkchatDB.createMessage(
        messageData.channelId,
        userIdentifier,
        messageData.message,
        messageData.type === 'image',
      );

      const resObj: ChannelMessageProps = {
        ...message,
        channelId: messageData.channelId,
        isMine: messageData.phoneNumber === phoneNumber,
        //type: messageData.type,
      };

      resp({ status: 'ok', data: resObj });

      const members = await this.darkchatDB.getChannelMembers(messageData.channelId);
      for (const member of members) {
        if (member.identifier !== userIdentifier) {
          const participant = PlayerService.getPlayerFromIdentifier(member.identifier);
          if (participant) {
            const resObj: ChannelMessageProps = {
              ...message,
              channelId: messageData.channelId,
              isMine: messageData.phoneNumber === participant.getPhoneNumber(),
              //type: messageData.type,
            };

            emitNetTyped<ChannelMessageProps>(
              DarkchatEvents.BROADCAST_MESSAGE,
              resObj,
              participant.source,
            );
          }
        }
      }
    } catch (err) {
      darkchatLogger.error(`Failed to create message. Error: ${err.message}`);
      resp({ status: 'error', errorMsg: err.message });
    }
  }

  async handleLeaveChannel(
    reqObj: PromiseRequest<{ channelId: number }>,
    resp: PromiseEventResp<void>,
  ): Promise<void> {
    const userIdentifier = PlayerService.getIdentifier(reqObj.source);

    try {
      await this.darkchatDB.leaveChannel(reqObj.data.channelId, userIdentifier);

      resp({ status: 'ok' });
    } catch (err) {
      darkchatLogger.error(`Failed to leave channel. Error: ${err.message}`);
      resp({ status: 'error', errorMsg: err.message });
    }
  }

  async handleUpdateChannelLabel(
    reqObj: PromiseRequest<UpdateLabelDto>,
    resp: PromiseEventResp<void>,
  ): Promise<void> {
    const userIdentifier = PlayerService.getIdentifier(reqObj.source);
    try {
      const channelData = reqObj.data;
      await this.darkchatDB.updateChannelLabel(reqObj.data);

      resp({ status: 'ok' });

      const members = await this.darkchatDB.getChannelMembers(reqObj.data.channelId);
      for (const member of members) {
        if (member.identifier !== userIdentifier) {
          const participant = PlayerService.getPlayerFromIdentifier(member.identifier);
          if (participant) {
            emitNetTyped<UpdateLabelDto>(
              DarkchatEvents.BROADCAST_MESSAGE,
              channelData,
              participant.source,
            );
          }
        }
      }
    } catch (err) {
      darkchatLogger.error(`Failed to update channel label. Error: ${err.message}`);
      resp({ status: 'error', errorMsg: err.message });
    }
  }

  async deleteChannel(
    reqObj: PromiseRequest<{ channelId: number }>,
    resp: PromiseEventResp<void>,
  ): Promise<void> {
    const userIdentifier = PlayerService.getIdentifier(reqObj.source);

    try {
      const owner = await this.darkchatDB.getChannelOwner(reqObj.data.channelId);
      const members = await this.darkchatDB.getMembers(reqObj.data.channelId);
      if (owner === userIdentifier) {
        await this.darkchatDB.deleteChannel(reqObj.data.channelId);
        resp({ status: 'ok' });

        for (const member of members) {
          if (member.identifier !== userIdentifier) {
            const participant = PlayerService.getPlayerFromIdentifier(member.identifier);
            if (participant) {
              emitNet(DarkchatEvents.DELETE_CHANNEL_SUCCESS, participant.source, {
                channelId: reqObj.data.channelId,
              });
            }
          }
        }
      }

      return resp({ status: 'error', errorMsg: 'NOT_OWNER' });
    } catch (err) {
      darkchatLogger.error(`Failed to delete channel. Error: ${err.message}`);
      resp({ status: 'error', errorMsg: err.message });
    }
  }
}

const DarkchatService = new _DarkchatService();
export default DarkchatService;
