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
  RemoveGroupMemberRequest,
  RemoveGroupMemberResponse,
  ConversationListResponse,
  MakeGroupOwner,
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
        playerPhoneNumber,
      );

      // Return data
      const respData = {
        id: conversationId,
        label: conversation.conversationLabel,
        conversationList,
        isGroupChat: conversation.isGroupChat,
        owner: playerPhoneNumber,
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

      const message = await this.messagesDB.createMessage({
        userIdentifier,
        authorPhoneNumber,
        conversationId: messageData.conversationId,
        message: messageData.message,
        is_embed: messageData.is_embed,
        embed: messageData.embed,
        is_system: messageData.is_system,
        system_type: messageData.system_type,
        system_number: messageData.system_number,
      });

      resp({
        status: 'ok',
        data: {
          ...message,
          message: message.message,
          conversation_id: messageData.conversationId,
          author: authorPhoneNumber,
          is_embed: messageData.is_embed,
          is_system: messageData.is_system,
          system_type: messageData.system_type,
          system_number: messageData.system_number,
        },
      });

      const conversationData = {
        id: messageData.conversationId,
        label: conversationDetails.label,
        conversationList: conversationDetails.conversationList,
        isGroupChat: conversationDetails.isGroupChat,
        owner: conversationDetails.owner,
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
                ...message,
                author: authorPhoneNumber,
              });
              emitNet(MessageEvents.CREATE_MESSAGE_BROADCAST, participantPlayer.source, {
                conversationName: authorPhoneNumber,
                conversation_id: messageData.conversationId,
                message: messageData.message,
                is_embed: messageData.is_embed,
                embed: messageData.embed,
                is_system: messageData.is_system,
                system_type: messageData.system_type,
                system_number: messageData.system_number,
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

  async handleRemoveGroupMember(
    reqObj: PromiseRequest<RemoveGroupMemberRequest>,
    resp: PromiseEventResp<ConversationListResponse>,
  ) {
    const phoneNumber = PlayerService.getPlayer(reqObj.source).getPhoneNumber();
    const groupOwner = await this.messagesDB.getGroupOwner(reqObj.data.conversationId);

    if (!reqObj.data.leaveGroup && groupOwner !== phoneNumber) {
      messagesLogger.error(`User does not own group. Error`);
      return resp({ status: 'error' });
    }

    if (reqObj.data.leaveGroup && reqObj.data.phoneNumber !== phoneNumber) {
      //if the user is leaving group and its not themself that is leaving then return an error as someone is trying to cheat
      messagesLogger.error(`User is trying to force another member to leave. Error`);
      return resp({ status: 'error' });
    }

    try {
      const updatedConversationList = reqObj.data.conversationList
        .split('+')
        .filter((number) => number != reqObj.data.phoneNumber)
        .join('+');
      await this.messagesDB.removeGroupMember(
        updatedConversationList,
        reqObj.data.conversationId,
        reqObj.data.phoneNumber,
      );
      resp({ status: 'ok', data: { conversationList: updatedConversationList } });

      const playerPhoneNumber = PlayerService.getPlayer(reqObj.source).getPhoneNumber();
      const participants = reqObj.data.conversationList.split('+');

      if (reqObj.data.leaveGroup && reqObj.data.phoneNumber === groupOwner) {
        //owner is trying to leave group, we need to assign a new owner
        //select a random member
        const newOwner = participants[Math.floor(Math.random() * participants.length)];
        //update the owner on the db
        await this.messagesDB.makeGroupOwner(reqObj.data.conversationId, newOwner);
        //get new owners identifier
        const participantIdentifier = await PlayerService.getIdentifierByPhoneNumber(newOwner);
        const participantPlayer = PlayerService.getPlayerFromIdentifier(participantIdentifier);
        //if owner online then update
        if (participantPlayer) {
          emitNetTyped(
            MessageEvents.UPDATE_GROUP_OWNER,
            {
              conversationId: reqObj.data.conversationId,
              phoneNumber: newOwner,
            },
            participantPlayer.source,
          );
        }
      }

      for (const participant of participants) {
        if (!reqObj.data.leaveGroup || participant === playerPhoneNumber) {
          //if not leave group (kick) and the participant is the person kicking then move to next player as he already has updated data
          continue;
        }

        const participantIdentifier = await PlayerService.getIdentifierByPhoneNumber(participant);
        const participantPlayer = PlayerService.getPlayerFromIdentifier(participantIdentifier);

        if (!participantPlayer) {
          //if not online, move to next player
          continue;
        }

        if (!reqObj.data.leaveGroup && participant === reqObj.data.phoneNumber) {
          //if not leave group/leave themself and participant is equal to nubmer remove then remove the chat from their list
          emitNetTyped(
            MessageEvents.DELETE_GROUP_MEMBER_CONVERSATION,
            {
              conversationID: [reqObj.data.conversationId],
            },
            participantPlayer.source,
          );
        }

        if (participant !== reqObj.data.phoneNumber) {
          //if they are not the one being removed then tell them who left
          emitNetTyped<RemoveGroupMemberResponse>(
            MessageEvents.DELETE_GROUP_MEMBER_LIST,
            {
              conversationId: reqObj.data.conversationId,
              phoneNumber: reqObj.data.phoneNumber,
            },
            participantPlayer.source,
          );
        }
      }
    } catch (err) {
      messagesLogger.error(`Failed to remove from group. Error: ${err.message}`);
      resp({ status: 'error' });
    }
  }

  // Exports
  async handleEmitMessage(dto: EmitMessageExportCtx) {
    const { senderNumber, targetNumber, message, embed } = dto;

    try {
      // this will post an error message if the number doesn't exist but emitMessage will so go through from roleplay number
      const senderPlayer = await PlayerService.getIdentifierFromPhoneNumber(senderNumber, true);

      const participantIdentifier = await PlayerService.getIdentifierFromPhoneNumber(targetNumber);
      const participantPlayer = PlayerService.getPlayerFromIdentifier(participantIdentifier);

      // Create our groupId hash
      const conversationList = createGroupHashID([senderNumber, targetNumber]);

      const doesConversationExist = await this.messagesDB.doesConversationExist(conversationList);
      let conversationId: number;

      // Generate conversation id or assign from existing conversation
      // If we generate the conversation we add the player and update their front-end if they're online
      if (!doesConversationExist) {
        conversationId = await this.messagesDB.createConversation(
          [senderNumber, targetNumber],
          conversationList,
          '',
          false,
          senderNumber,
        );

        if (participantPlayer) {
          emitNetTyped<MessageConversation>(
            MessageEvents.CREATE_MESSAGE_CONVERSATION_SUCCESS,
            {
              id: conversationId,
              conversationList,
              label: '',
              isGroupChat: false,
              participant: targetNumber,
              owner: senderNumber,
            },
            participantPlayer.source,
          );
        }
      } else {
        conversationId = await this.messagesDB.getConversationId(conversationList);
      }

      const messageId = await this.messagesDB.createMessage({
        message,
        embed: embed,
        is_embed: !!embed,
        conversationId,
        userIdentifier: senderPlayer || senderNumber,
        authorPhoneNumber: senderNumber,
      });

      // Create respondObj
      const messageData = {
        id: messageId,
        message,
        embed: embed || '',
        is_embed: !!embed,
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
          is_embed: messageData.is_embed,
          embed: messageData.embed,
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

  async handleMakeGroupOwner(reqObj: PromiseRequest<MakeGroupOwner>, resp: PromiseEventResp<void>) {
    const phoneNumber = PlayerService.getPlayer(reqObj.source).getPhoneNumber();
    const groupOwner = await this.messagesDB.getGroupOwner(reqObj.data.conversationId);

    if (groupOwner !== phoneNumber) {
      messagesLogger.error(`User does not own group. Error`);
      return resp({ status: 'error' });
    }

    try {
      await this.messagesDB.makeGroupOwner(reqObj.data.conversationId, reqObj.data.phoneNumber);

      resp({ status: 'ok' });
      const participantIdentifier = await PlayerService.getIdentifierByPhoneNumber(
        reqObj.data.phoneNumber,
      );
      const participantPlayer = PlayerService.getPlayerFromIdentifier(participantIdentifier);

      if (!participantPlayer) {
        //if not online return
        return;
      }

      if (participantPlayer) {
        emitNetTyped(
          MessageEvents.UPDATE_GROUP_OWNER,
          {
            conversationId: reqObj.data.conversationId,
            phoneNumber: reqObj.data.phoneNumber,
          },
          participantPlayer.source,
        );
      }
    } catch (err) {
      messagesLogger.error(`Failed to make group owner. Error: ${err.message}`);
      resp({ status: 'error' });
    }
  }
}

const MessagesService = new _MessagesService();

export default MessagesService;
