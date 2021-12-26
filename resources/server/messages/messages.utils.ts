import { CreateMessageGroupResult, MessageConversation } from '../../../typings/messages';
import { mainLogger } from '../sv_logger';
import MessagesDB from './messages.db';
import PlayerService from '../players/player.service';

export const messagesLogger = mainLogger.child({ module: 'messages' });

// Functions
export async function getConsolidatedMessageGroups(identifier: string): Promise<any> {
  const messageConversations = await MessagesDB.getMessageConversations(identifier);
  return messageConversations.reduce((mapping: any, conversation: any) => {
    const groupId = conversation.conversation_id;

    if (conversation.participant_identifier != identifier) {
      mapping[groupId] = {
        unread: conversation.unread,
        phoneNumber: conversation.phone_number,
        display: conversation.display,
        conversation_id: conversation.conversation_id,
        user_identifier: identifier,
      };
    }

    return mapping;
  }, {});
}

export async function getFormattedMessageConversations(
  identifier: string,
): Promise<MessageConversation[]> {
  const conversationMapping = await getConsolidatedMessageGroups(identifier);
  const conversationIds = await getGroupIds(identifier, conversationMapping);

  return conversationIds.map((conversationId) => {
    const conversation = conversationMapping[conversationId];

    return {
      ...conversation,
    };
  });
}

export async function getGroupIds(userIdentifier: string, groupMapping: any): Promise<string[]> {
  const groupIds: string[] = [];
  for (const groupId of Object.keys(groupMapping)) {
    const isMine = (groupMapping[groupId].user_identifier = userIdentifier);
    if (isMine) {
      groupIds.push(groupId);
    }
  }
  return groupIds;
}

/**
 * Create the same unique ID from an identifiers array.
 * They will be always be sorted to ensure always the same ID.
 * @param participants array of player identifiers
 */
export function createGroupHashID(participants: string[]) {
  // make sure we are always in a consistent order. It is very important
  // that this not change! Changing this order can result in the ability
  // of duplicate message groups being created.
  participants.sort();
  return participants.join('+');
  // we don't need this to be secure. Its purpose is to create a unique
  // string derived from the identifiers. In this way we can check
  // that this groupId isn't used before. If it has then it means
  // we are trying to create a duplicate message group!
}

/**
 * Main method to handle creation of new message groups. First
 * we retrieve identifiers for each submitted phone number and
 * then rows in npwd_messages_groups are created for each of them
 * bound to a unique groupId. The groupId is any unique string - we
 * use hashes here.
 *
 * These queries are batched with a transaction so that if any of
 * them fail the queries are not committed to the database. This helps
 * avoid situations where some participants get added to the group but
 * one fails resulting in a partial group which would be very confusing
 * to the player.
 * @param sourcePhoneNumber - user who is creating the group
 * @param tgtPhoneNumber - list of phone numbers to add to the grup
 */
export async function createMessageGroupsFromPhoneNumber(
  sourcePhoneNumber: string,
  tgtPhoneNumber: string,
): Promise<CreateMessageGroupResult> {
  // we check that each phoneNumber exists before we create the group

  const tgtIdentifier = await PlayerService.getIdentifierFromPhoneNumber(tgtPhoneNumber, true);

  if (!tgtIdentifier) {
    throw new Error('tgtIdentifier was null');
  }

  const conversationId = createGroupHashID([sourcePhoneNumber, tgtPhoneNumber]);
  const existingConversation = await MessagesDB.doesConversationExist(
    conversationId,
    tgtPhoneNumber,
  );

  if (existingConversation) {
    await MessagesDB.createMessageGroup(
      existingConversation.user_identifier,
      conversationId,
      sourcePhoneNumber,
    );
  } else {
    await MessagesDB.createMessageGroup(sourcePhoneNumber, conversationId, sourcePhoneNumber);
    await MessagesDB.createMessageGroup(sourcePhoneNumber, conversationId, tgtPhoneNumber);
  }

  // wrap this in a transaction to make sure ALL of these INSERTs succeed
  // so we are not left in a situation where only some of the member of the
  // group exist while other are left off.

  return {
    error: false,
    doesExist: existingConversation,
    conversationId,
    identifiers: [sourcePhoneNumber, tgtPhoneNumber],
    phoneNumber: tgtPhoneNumber,
    participant: tgtIdentifier,
  };
}

// getting the participants from groupId.
// this should return the source or and array of identifiers
export function getIdentifiersFromParticipants(conversationId: string) {
  return conversationId.split('+');
}
