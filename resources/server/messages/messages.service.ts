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

// felt good to just remove group chats.
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
    resp: PromiseEventResp<any>,
  ) {
    try {
      const _identifier = PlayerService.getIdentifier(reqObj.source);
      const result = await createMessageGroupsFromPhoneNumber(
        _identifier,
        reqObj.data.targetNumber,
      );

      if (result.error) {
        return resp({ status: 'error' });
      }

      resp({
        status: 'ok',
        data: { conversation_id: result.conversationId, phoneNumber: result.phoneNumber },
      });
    } catch (e) {
      resp({ status: 'error', errorMsg: 'DB_ERROR' });

      messagesLogger.error(`Failed to create message group, ${e.message}`, {
        source: reqObj.source,
        e,
      });
    }
  }

  async handleFetchInitialMessages(
    reqObj: PromiseRequest<{ conversationId: string }>,
    resp: PromiseEventResp<Message[]>,
  ) {
    try {
      const messages = await this.messagesDB.getInitialMessages(reqObj.data.conversationId);

      messages.sort((a, b) => a.id - b.id);

      resp({ status: 'ok', data: messages });
    } catch (e) {
      resp({ status: 'error', errorMsg: 'DB_ERROR' });
      messagesLogger.error(`Failed to fetch messages, ${e.message}`, {
        source: reqObj.source,
      });
    }
  }

  async handleFetchMessages(
    reqObj: PromiseRequest<{ conversationId: string; page: number }>,
    resp: PromiseEventResp<Message[]>,
  ) {
    try {
      const messages = await this.messagesDB.getMessages(
        reqObj.data.conversationId,
        reqObj.data.page,
      );

      if (messages.length === 0) return;

      messages.sort((a, b) => a.id - b.id);

      resp({ status: 'ok', data: messages });
    } catch (e) {
      resp({ status: 'error', errorMsg: 'DB_ERROR' });
      messagesLogger.error(`Failed to fetch messages, ${e.message}`, {
        source: reqObj.source,
      });
    }
  }

  async handleSendMessage(reqObj: PromiseRequest<PreDBMessage>, resp: PromiseEventResp<Message>) {
    try {
      const player = PlayerService.getPlayer(reqObj.source);
      const authorPhoneNumber = player.getPhoneNumber();
      const messageData = reqObj.data;
      const participants = getIdentifiersFromParticipants(messageData.conversationId);

      const messageId = await this.messagesDB.createMessage(
        authorPhoneNumber,
        messageData.conversationId,
        messageData.message,
      );

      console.log('message id', messageId);

      resp({
        status: 'ok',
        data: {
          ...messageData,
          conversation_id: messageData.conversationId,
          author: authorPhoneNumber,
          id: messageId,
        },
      });

      for (const participantId of participants) {
        if (participantId !== player.getIdentifier()) {
          const participantPlayer = PlayerService.getPlayerFromIdentifier(participantId);

          if (!participantPlayer) {
            return;
          }

          emitNet(MessageEvents.SEND_MESSAGE_SUCCESS, participantPlayer.source, messageData);
          emitNet(MessageEvents.CREATE_MESSAGE_BROADCAST, participantPlayer.source, {
            conversationName: player.getPhoneNumber(),
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

  async handleDeleteMessage(reqObj: PromiseRequest<Message>, resp: PromiseEventResp<void>) {
    try {
      await this.messagesDB.deleteMessage(reqObj.data);
      resp({ status: 'ok' });
    } catch (e) {
      resp({ status: 'error', errorMsg: 'DB_ERROR' });
      messagesLogger.error(`Failed to delete message, ${e.message}`, {
        source: reqObj.source,
      });
    }
  }
}

const MessagesService = new _MessagesService();

export default MessagesService;
