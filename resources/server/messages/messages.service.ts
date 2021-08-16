import PlayerService from '../players/player.service';
import { MessageEvents } from '../../../typings/messages';
import MessagesDB, { _MessagesDB } from './messages.db';
import {
  createMessageGroupsFromPhoneNumbers,
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

      /*emitNet(MessageEvents.FETCH_MESSAGE_GROUPS_SUCCESS, src, messageGroups);*/
      resp({ status: 'ok', data: messageConversations });
    } catch (e) {
      /*emitNet(MessageEvents.FETCH_MESSAGE_GROUPS_FAILED, src);*/
      resp({ status: 'error', errorMsg: 'DB_ERROR' });
      messagesLogger.error(`Failed to fetch messages groups, ${e.message}`);
    }
  }

  async handleCreateMessageGroup(src: number, phoneNumbers: string[], label: string = null) {
    try {
      const _identifier = PlayerService.getIdentifier(src);
      const result = await createMessageGroupsFromPhoneNumbers(_identifier, phoneNumbers, label);

      if (result.error && result.allNumbersFailed) {
        emitNet(MessageEvents.CREATE_MESSAGE_GROUP_FAILED, src, result);
        return emitNet(MessageEvents.ACTION_RESULT, src, {
          message: `APPS_MESSAGES_MESSAGE_GROUP_CREATE_ALL_NUMBERS_FAILED`,
          type: 'error',
        });
      }

      if (result.error) {
        emitNet(MessageEvents.CREATE_MESSAGE_GROUP_FAILED, src, result);
        return emitNet(MessageEvents.ACTION_RESULT, src, {
          message: `APPS_MESSAGES_MESSAGE_GROUP_CREATE_FAILED`,
          type: 'error',
        });
      }

      if (result.failedNumbers.length === 1) {
        emitNet(MessageEvents.ACTION_RESULT, src, {
          message: `APPS_MESSAGES_MESSAGE_GROUP_CREATE_ONE_NUMBER_FAILED`,
          type: 'warning',
          options: { number: result.failedNumbers[0] },
        });
      }

      if (result.failedNumbers.length > 1) {
        emitNet(MessageEvents.ACTION_RESULT, src, {
          message: `APPS_MESSAGES_MESSAGE_GROUP_CREATE_SOME_NUMBERS_FAILED`,
          type: 'warning',
          options: { numbers: result.failedNumbers.join(', ') },
        });
      }

      emitNet(MessageEvents.CREATE_MESSAGE_GROUP_SUCCESS, src, result);
      if (result.duplicate) {
        return;
      }

      if (result.identifiers) {
        for (const participantId of result.identifiers) {
          // we don't broadcast to the source of the event.
          if (participantId !== _identifier) {
            const participantPlayer = PlayerService.getPlayerFromIdentifier(participantId);
            if (!participantPlayer) {
              return;
            }
            emitNet(MessageEvents.FETCH_MESSAGE_CONVERSATIONS, participantPlayer.source);
          }
        }
      }
    } catch (e) {
      emitNet(MessageEvents.CREATE_MESSAGE_GROUP_FAILED, src);
      emitNet(MessageEvents.ACTION_RESULT, src, {
        message: `APPS_MESSAGES_MESSAGE_GROUP_CREATE_FAILED`,
        type: 'error',
      });
      messagesLogger.error(`Failed to create message group, ${e.message}`, {
        source: src,
        e,
      });
    }
  }

  async handleFetchMessages(src: number, groupId: string) {
    try {
      const _identifier = PlayerService.getIdentifier(src);
      const messages = await this.messagesDB.getMessages(_identifier, groupId);
      emitNet(MessageEvents.FETCH_MESSAGES_SUCCESS, src, messages);
    } catch (e) {
      emitNet(MessageEvents.FETCH_MESSAGES_FAILED, src);
      messagesLogger.error(`Failed to fetch messages, ${e.message}`, {
        source: src,
      });
    }
  }

  async handleSendMessage(src: number, conversationId: number, message: string) {
    try {
      const _identifier = PlayerService.getIdentifier(src);
      const participantId = getIdentifiersFromParticipants(conversationId);

      await this.messagesDB.createMessage(_identifier, conversationId, message);

      emitNet(MessageEvents.SEND_MESSAGE_SUCCESS, src, conversationId);

      // gets the identifiers foe the participants for current groupId.

      const participantPlayer = PlayerService.getPlayerFromIdentifier(participantId);
      emitNet(MessageEvents.CREATE_MESSAGE_BROADCAST, participantPlayer.source, {
        conversationName: participantPlayer.getPhoneNumber(), // We check if we have a contact on the NUI side.
        conversationId,
        message,
      });
    } catch (e) {
      emitNet(MessageEvents.ACTION_RESULT, src, {
        message: 'APPS_MESSAGES_NEW_MESSAGE_FAILED',
        type: 'error',
      });
      messagesLogger.error(`Failed to send message, ${e.message}`, {
        source: src,
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
}

const MessagesService = new _MessagesService();

export default MessagesService;
