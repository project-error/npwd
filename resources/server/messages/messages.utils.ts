import { withTransaction } from '../db/pool';
import {
  CreateMessageGroupResult,
  MessageConversation,
  MessageGroup,
  MessageGroupMapping,
} from '../../../typings/messages';
import { mainLogger } from '../sv_logger';
import MessagesDB from './messages.db';

export const messagesLogger = mainLogger.child({ module: 'messages' });

// Functions

export async function getFormattedMessageConversations(
  identifier: any,
): Promise<MessageConversation> {
  const messageConversations = await MessagesDB.getMessageConversations(identifier);
  return messageConversations.reduce((mapping: any, conversation: any) => {
    const groupId = conversation.conversation_id;
    const isUser = conversation.participant_identifier == identifier;
    const myNumber = '449731';

    if (conversation.participant_identifier != identifier) {
      mapping[groupId] = {
        unread: conversation.unread,
        phoneNumber: conversation.phone_number,
        display: conversation.display,
      };
    }

    return mapping;
  }, {});
}

export async function getGroupIds(
  userIdentifier: string,
  groupMapping: MessageGroupMapping,
): Promise<string[]> {
  const groupIds: string[] = [];
  for (const groupId of Object.keys(groupMapping)) {
    const isMine = groupMapping[groupId].user_identifier == userIdentifier;
    if (isMine || (await MessagesDB.getMessageCountByGroup(groupId)) > 0) {
      groupIds.push(groupId);
    }
  }
  return groupIds;
}

/**
 * Given the mapping of groupId: fields contents reduce it into a list
 * of MessageGroup objects ready for the UI to consume
 * @param userIdentifier - user to generate the MessageGroups for
 */
/*export async function getFormattedMessageGroups(userIdentifier: string): Promise<MessageGroup[]> {
  const groupMapping = await getConsolidatedMessageGroups(userIdentifier);
  const groupIds = await getGroupIds(userIdentifier, groupMapping);

  return groupIds.map((groupId) => {
    const group = groupMapping[groupId];
    return {
      ...group,
      groupId,
      groupDisplay: group.participants.join(', '),
      // note that the 1 here references how many participants besides the user
      isGroupChat: group.participants.length > 1,
    };
  });
}*/

/**
 * Create the same unique ID from an identifiers array.
 * They will be always be sorted to ensure always the same ID.
 * @param identifiers array of player identifiers
 */
export function createGroupHashID(identifiers: string[]) {
  // make sure we are always in a consistent order. It is very important
  // that this not change! Changing this order can result in the ability
  // of duplicate message groups being created.
  identifiers.sort();
  const mergedIdentifiers = identifiers.join('+');
  // we don't need this to be secure. Its purpose is to create a unique
  // string derived from the identifiers. In this way we can check
  // that this groupId isn't used before. If it has then it means
  // we are trying to create a duplicate message group!
  return mergedIdentifiers;
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
 * @param userIdentifier - user who is creating the group
 * @param phoneNumbers - list of phone numbers to add to the grup
 * @param groupLabel - optional group label to give the group
 */
export async function createMessageGroupsFromPhoneNumbers(
  userIdentifier: string,
  phoneNumbers: string[],
  groupLabel: string,
): Promise<CreateMessageGroupResult> {
  // we check that each phoneNumber exists before we create the group
  const identifiers: string[] = [];
  const failedNumbers: string[] = [];

  for (const phoneNumber of phoneNumbers) {
    try {
      const identifier = await MessagesDB.getIdentifierFromPhoneNumber(phoneNumber);
      identifiers.push(identifier);
    } catch (e) {
      failedNumbers.push(phoneNumber);
    }
  }

  if (phoneNumbers.length === failedNumbers.length) {
    return { error: true, allNumbersFailed: true, failedNumbers };
  }

  // don't allow explicitly adding yourself
  if (identifiers.some((identifier) => identifier == userIdentifier)) {
    return { error: true, mine: true, failedNumbers };
  }

  const groupId = createGroupHashID([userIdentifier, ...identifiers]);
  if (await MessagesDB.checkIfMessageGroupExists(groupId)) {
    return { error: false, duplicate: true, groupId, identifiers, failedNumbers };
  }

  const queryPromises = [
    // create a row that contains ourselves so reverse accessing from
    // other players works as expected
    MessagesDB.createMessageGroup(userIdentifier, groupId, userIdentifier),
    ...identifiers.map((identifier) =>
      MessagesDB.createMessageGroup(userIdentifier, groupId, identifier),
    ),
  ];

  // wrap this in a transaction to make sure ALL of these INSERTs succeed
  // so we are not left in a situation where only some of the member of the
  // group exist while other are left off.
  await withTransaction(queryPromises);

  return { error: false, groupId, identifiers, failedNumbers };
}

// getting the participants from groupId.
// this should return the source or and array of identifiers
export function getIdentifiersFromParticipants(groupId: number) {
  // TODO: I guess we either have to do a db query or just send the participant form the NUI > client > server;
  return 'some id';
}
