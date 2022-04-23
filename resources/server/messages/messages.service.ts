import MessagesDB, { _MessagesDB } from './messages.db';
import {
  createGroupHashID,
  getIdentifiersFromParticipants,
  messagesLogger,
} from './messages.utils';
import { PromiseEventResp, PromiseRequest } from '../lib/PromiseNetEvents/promise.types';
import {
  DeleteConversationRequest,
  EmitMessageExportCtx,
  Message,
  MessageConversation,
  MessageEvents,
  MessagesRequest,
  PreDBConversation,
  PreDBMessage,
  Location,
} from '../../../typings/messages';
import PlayerService from '../players/player.service';
import { emitNetTyped } from '../utils/miscUtils';

class _MessagesService {
  private readonly messagesDB: _MessagesDB;

  constructor() {
    this.messagesDB = MessagesDB;
    messagesLogger.debug('Messages service started');
  }

  async handleFetchMessageConversations(
    reqObj: PromiseRequest<void>,
    resp: PromiseEventResp<MessageConversation[]>,
  ) {
    const phoneNumber = PlayerService.getPlayer(reqObj.source).getPhoneNumber();

    try {
      const conversations = await MessagesDB.getConversations(phoneNumber);

      resp({ status: 'ok', data: conversations });
    } catch (err) {
      resp({ status: 'error', errorMsg: err.message });
    }
  }

  async handleCreateMessageConversation(
    reqObj: PromiseRequest<PreDBConversation>,
    resp: PromiseEventResp<MessageConversation>,
  ) {
    const playerPhoneNumber = PlayerService.getPlayer(reqObj.source).getPhoneNumber();
    const conversation = reqObj.data;
    const participants = conversation.participants;

    const conversationList = createGroupHashID(participants);

    const doesExist = await this.messagesDB.doesConversationExist(conversationList);

    if (doesExist) {
      const playerHasConversation = await this.messagesDB.doesConversationExistForPlayer(
        conversationList,
        playerPhoneNumber,
      );

      if (playerHasConversation) {
        return resp({
          status: 'error',
          errorMsg: 'MESSAGES.FEEDBACK.MESSAGE_CONVERSATION_DUPLICATE',
        });
      } else {
        const conversationId = await this.messagesDB.addParticipantToConversation(
          conversationList,
          playerPhoneNumber,
        );

        const respData = {
          id: conversationId,
          label: conversation.conversationLabel,
          conversationList,
          isGroupChat: conversation.isGroupChat,
        };

        return resp({ status: 'ok', data: { ...respData, participant: playerPhoneNumber } });
      }
    }

    try {
      const conversationId = await MessagesDB.createConversation(
        participants,
        conversationList,
        conversation.conversationLabel,
        conversation.isGroupChat,
      );

      // Return data
      const respData = {
        id: conversationId,
        label: conversation.conversationLabel,
        conversationList,
        isGroupChat: conversation.isGroupChat,
      };

      resp({ status: 'ok', data: { ...respData, participant: playerPhoneNumber } });

      for (const participant of participants) {
        if (participant !== playerPhoneNumber) {
          const participantIdentifier = await PlayerService.getIdentifierByPhoneNumber(participant);
          const participantPlayer = PlayerService.getPlayerFromIdentifier(participantIdentifier);

          if (participantPlayer) {
            emitNetTyped<MessageConversation>(
              MessageEvents.CREATE_MESSAGE_CONVERSATION_SUCCESS,
              {
                ...respData,
                participant: participantPlayer.getPhoneNumber(),
              },
              participantPlayer.source,
            );
          }
        }
      }
    } catch (err) {
      messagesLogger.error(
        `Error occurred on creating message conversation (${reqObj.source}), Error: ${err.message}`,
      );
      resp({ status: 'error', errorMsg: err.message });
    }
  }

  async handleFetchMessages(
    reqObj: PromiseRequest<MessagesRequest>,
    resp: PromiseEventResp<Message[]>,
  ) {
    try {
      const messages = await MessagesDB.getMessages(reqObj.data);

      // its just 20 elements, won't do that much harm
      const sortedMessages = messages.sort((a, b) => a.id - b.id);

      resp({ status: 'ok', data: sortedMessages });
    } catch (err) {
      resp({ status: 'error', errorMsg: err.message });
    }
  }

  async handleSendMessage(reqObj: PromiseRequest<PreDBMessage>, resp: PromiseEventResp<Message>) {
    try {
      const player = PlayerService.getPlayer(reqObj.source);
      const authorPhoneNumber = player.getPhoneNumber();
      const messageData = reqObj.data;
      const participants = getIdentifiersFromParticipants(messageData.conversationList);
      const userIdentifier = player.getIdentifier();

      const conversationDetails = await this.messagesDB.getConversation(messageData.conversationId);

      const messageId = await this.messagesDB.createMessage({
        userIdentifier,
        authorPhoneNumber,
        conversationId: messageData.conversationId,
        message: messageData.message,
        is_embed: messageData.is_embed,
        embed: messageData.embed,
      });

      resp({
        status: 'ok',
        data: {
          ...messageData,
          conversation_id: messageData.conversationId,
          author: authorPhoneNumber,
          id: messageId,
          message: messageData.message,
          embed: messageData.embed,
          is_embed: messageData.is_embed,
        },
      });

      const conversationData = {
        id: messageData.conversationId,
        label: conversationDetails.label,
        conversationList: conversationDetails.conversationList,
        isGroupChat: conversationDetails.isGroupChat,
      };

      // participantId is the participants phone number
      for (const participantId of participants) {
        if (participantId !== authorPhoneNumber) {
          try {
            const playerHasConversation = await this.messagesDB.doesConversationExistForPlayer(
              messageData.conversationList,
              participantId,
            );

            // We need to create a conversation for the participant before broadcasting
            if (!playerHasConversation) {
              const conversationId = await this.messagesDB.addParticipantToConversation(
                conversationDetails.conversationList,
                participantId,
              );
            }

            const participantIdentifier = await PlayerService.getIdentifierByPhoneNumber(
              participantId,
              true,
            );

            const participantNumber = await PlayerService.getPhoneNumberFromIdentifier(
              participantIdentifier,
            );

            const participantPlayer = PlayerService.getPlayerFromIdentifier(participantIdentifier);

            await this.messagesDB.setMessageUnread(messageData.conversationId, participantNumber);

            if (participantPlayer) {
              if (!playerHasConversation) {
                emitNetTyped<MessageConversation>(
                  MessageEvents.CREATE_MESSAGE_CONVERSATION_SUCCESS,
                  {
                    ...conversationData,
                    participant: authorPhoneNumber,
                  },
                  participantPlayer.source,
                );
              }

              emitNet(MessageEvents.SEND_MESSAGE_SUCCESS, participantPlayer.source, {
                ...messageData,
                conversation_id: messageData.conversationId,
                author: authorPhoneNumber,
              });
              emitNet(MessageEvents.CREATE_MESSAGE_BROADCAST, participantPlayer.source, {
                conversationName: authorPhoneNumber,
                conversation_id: messageData.conversationId,
                message: messageData.message,
                is_embed: messageData.is_embed,
                embed: messageData.embed,
              });
            }
          } catch (err) {
            messagesLogger.warn(`Failed to broadcast message. Player is not online.`);
          }
        }
      }
    } catch (err) {
      resp({ status: 'error', errorMsg: err.message });
    }
  }

  async handleSetMessageRead(reqObj: PromiseRequest<number>, resp: PromiseEventResp<void>) {
    const phoneNumber = PlayerService.getPlayer(reqObj.source).getPhoneNumber();

    try {
      await this.messagesDB.setMessageRead(reqObj.data, phoneNumber);

      resp({ status: 'ok' });
    } catch (err) {
      messagesLogger.error(`Failed to read message. Error: ${err.message}`);
      resp({ status: 'error' });
    }
  }

  async handleDeleteMessage(reqObj: PromiseRequest<Message>, resp: PromiseEventResp<void>) {
    try {
      await this.messagesDB.deleteMessage(reqObj.data);

      resp({ status: 'ok' });
    } catch (err) {
      resp({ status: 'error', errorMsg: err.message });
    }
  }

  async handleDeleteConversation(
    reqObj: PromiseRequest<DeleteConversationRequest>,
    resp: PromiseEventResp<void>,
  ) {
    const phoneNumber = PlayerService.getPlayer(reqObj.source).getPhoneNumber();
    const conversationsId = reqObj.data.conversationsId;

    try {
      for (const id of conversationsId) {
        await this.messagesDB.deleteConversation(id, phoneNumber);
      }
      resp({ status: 'ok' });
    } catch (err) {
      resp({ status: 'error', errorMsg: err.message });
    }
  }

  // Exports
  async handleEmitMessage(dto: EmitMessageExportCtx) {
    const { senderNumber, targetNumber, message } = dto;

    try {
      const senderPlayer = await PlayerService.getIdentifierByPhoneNumber(senderNumber, true);

      const participantIdentifier = await PlayerService.getIdentifierByPhoneNumber(targetNumber);
      const participantPlayer = PlayerService.getPlayerFromIdentifier(participantIdentifier);

      // Create our groupId hash
      const conversationList = createGroupHashID([senderNumber, targetNumber]);
      // Get our conversationId
      const conversationId = await this.messagesDB.getConversationId(conversationList);

      const messageId = await this.messagesDB.createMessage({
        message,
        embed: '',
        is_embed: false,
        conversationId,
        userIdentifier: senderPlayer || senderNumber,
        authorPhoneNumber: senderNumber,
      });

      // Create respondObj
      const messageData = {
        id: messageId,
        message,
        conversationList,
        conversation_id: conversationId,
        author: senderNumber,
      };

      if (participantPlayer) {
        emitNet(MessageEvents.SEND_MESSAGE_SUCCESS, participantPlayer.source, {
          ...messageData,
          conversation_id: conversationId,
          author: senderNumber,
        });
        emitNet(MessageEvents.CREATE_MESSAGE_BROADCAST, participantPlayer.source, {
          conversationName: senderNumber,
          conversation_id: conversationId,
          message: messageData.message,
        });
      }

      await this.messagesDB.setMessageUnread(conversationId, targetNumber);
    } catch (err) {
      console.log(`Failed to emit message. Error: ${err.message}`);
    }
  }

  async handleGetLocation(reqObj: PromiseRequest, resp: PromiseEventResp<Location>) {
    const phoneNumber = PlayerService.getPlayer(reqObj.source).getPhoneNumber();
    const playerPed = GetPlayerPed(reqObj.source.toString());

    resp({
      status: 'ok',
      data: {
        phoneNumber,
        coords: GetEntityCoords(playerPed),
      },
    });
  }
}

const MessagesService = new _MessagesService();

export default MessagesService;
