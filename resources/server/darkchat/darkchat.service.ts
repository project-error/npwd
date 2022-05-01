import DarkchatDB, { _DarkchatDB } from './darkchat.db';
import {
  ChannelItemProps,
  ChannelMessageProps,
  DarkchatEvents,
  JoinChannelDTO,
  MessageDTO,
} from '../../../typings/darkchat';
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

  async handleJoinChannel(
    reqObj: PromiseRequest<JoinChannelDTO>,
    resp: PromiseEventResp<ChannelItemProps>,
  ): Promise<void> {
    const identifier = PlayerService.getIdentifier(reqObj.source);
    try {
      const channelExists = await this.darkchatDB.doesChannelExist(reqObj.data.channelIdentifier);
      console.log('does exist', channelExists);
      if (!channelExists)
        await this.darkchatDB.createChannel(reqObj.data.channelIdentifier, reqObj.data.label);

      const channelId = await this.darkchatDB.joinChannel(
        reqObj.data.channelIdentifier,
        identifier,
      );

      const resData: ChannelItemProps = {
        id: channelId,
        identifier: reqObj.data.channelIdentifier,
        label: reqObj.data.label,
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
      );

      const resObj: ChannelMessageProps = {
        ...message,
        channelId: messageData.channelId,
        isMine: messageData.phoneNumber === phoneNumber,
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
}

const DarkchatService = new _DarkchatService();
export default DarkchatService;
