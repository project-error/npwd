import PlayerService from '../players/player.service';
import { Message, MessageEvents, PreDBMessage } from '../../../typings/messages';
import MessagesDB, { _MessagesDB } from './messages.db';
import {
  createMessageGroupsFromPhoneNumber,
  getFormattedMessageConversations,
  getIdentifiersFromParticipants,
  messagesLogger,
} from './messages.utils';
import { PromiseEventResp, PromiseRequest } from '../utils/PromiseNetEvents/promise.types';

class _MessagesService {
  private readonly messagesDB: _MessagesDB;

  constructor() {
    this.messagesDB = MessagesDB;
    messagesLogger.debug('Messages service started');
  }

  async handleFetchMessageConversations(reqObj: PromiseRequest, resp: PromiseEventResp<any>) {
    try {
      const identifier = PlayerService.getIdentifier(reqObj.source);
      const messageConversations = await getFormattedMessageConversations(identifier);

      resp({ status: 'ok', data: messageConversations });
    } catch (e) {
      resp({ status: 'error', errorMsg: 'DB_ERROR' });
      messagesLogger.error(`Failed to fetch messages groups, ${e.message}`);
    }
  }

  async handleCreateMessageConversation(
    reqObj: PromiseRequest<{ targetNumber: string }>,
    resp: PromiseEventResp<boolean>,
  ) {
    try {
      const _identifier = PlayerService.getIdentifier(reqObj.source);
      const result = await createMessageGroupsFromPhoneNumber(
        _identifier,
        reqObj.data.targetNumber,
      );

      if (result.error) {
        return resp({ status: 'error', data: false });
      }
    } catch (e) {
      resp({ status: 'error', errorMsg: 'DB_ERROR' });

      messagesLogger.error(`Failed to create message group, ${e.message}`, {
        source: reqObj.source,
        e,
      });
    }
  }

  async handleFetchMessages(
    reqObj: PromiseRequest<{ conversationId: string }>,
    resp: PromiseEventResp<Message[]>,
  ) {
    try {
      const messages = await this.messagesDB.getMessages(reqObj.data.conversationId);

      resp({ status: 'ok', data: messages });
    } catch (e) {
      resp({ status: 'error', errorMsg: 'DB_ERROR' });
      messagesLogger.error(`Failed to fetch messages, ${e.message}`, {
        source: reqObj.source,
      });
    }
  }

  async handleSendMessage(
    reqObj: PromiseRequest<PreDBMessage>,
    resp: PromiseEventResp<PreDBMessage>,
  ) {
    try {
      const player = PlayerService.getPlayer(reqObj.source);
      const authorPhoneNumber = player.getPhoneNumber();
      const messageData = reqObj.data;
      const participants = getIdentifiersFromParticipants(messageData.conversationId);

      await this.messagesDB.createMessage(
        authorPhoneNumber,
        messageData.conversationId,
        messageData.message,
      );

      resp({ status: 'ok', data: messageData });

      // FIXME: This still causes an error when sending to an offline player it seems.
      for (const participantId of participants) {
        console.log('id', participantId);
        if (participantId !== player.getIdentifier()) {
          const participantPlayer = PlayerService.getPlayerFromIdentifier(participantId);

          console.log('part id', participantPlayer);
          console.log('part source', participantPlayer.source);

          if (!participantPlayer) {
            return;
          }

          emitNet(MessageEvents.SEND_MESSAGE_SUCCESS, participantPlayer.source, messageData);

          emitNet(MessageEvents.CREATE_MESSAGE_BROADCAST, participantPlayer.source, {
            conversationName: participantPlayer.getPhoneNumber(),
            conversationId: messageData.conversationId,
            message: messageData.message,
          });
        }
      }
    } catch (e) {
      emitNet(MessageEvents.ACTION_RESULT, reqObj.source, {
        message: 'APPS_MESSAGES_NEW_MESSAGE_FAILED',
        type: 'error',
      });
      messagesLogger.error(`Failed to send message, ${e.message}`, {
        source: reqObj.source,
      });
    }
  }

  async handleSetMessageRead(src: number, groupId: string) {
    try {
      const identifier = PlayerService.getIdentifier(src);
      await this.messagesDB.setMessageRead(groupId, identifier);
      emitNet(MessageEvents.FETCH_MESSAGE_CONVERSATIONS, src);
    } catch (e) {
      messagesLogger.error(`Failed to set message as read, ${e.message}`, {
        source: src,
      });
    }
  }

  async handleDeleteConversation(
    reqObj: PromiseRequest<{ conversationId: string }>,
    resp: PromiseEventResp<void>,
  ) {
    try {
      await this.messagesDB.deleteConversation(reqObj.data.conversationId);
      resp({ status: 'ok' });
    } catch (e) {
      resp({ status: 'error', errorMsg: 'DB_ERROR' });
      messagesLogger.error(`Failed to delete conversation, ${e.message}`, {
        source: reqObj.source,
      });
    }
  }
}

const MessagesService = new _MessagesService();

export default MessagesService;
