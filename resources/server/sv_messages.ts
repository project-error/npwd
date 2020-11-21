import { v4 as uuidv4 } from 'uuid';

import events from '../utils/events';
import { Message, MessageGroup } from '../../phone/src/common/interfaces/messages';
import { pool, withTransaction } from "./db";
import { getSource, useIdentifier } from './functions';

interface UnformattedMessageGroup {
  group_id: string;
  participant_identifier: string;
  phone_number: string;
  label?: string;
  avatar?: string;
  display?: string;
  updatedAt: string;
}

interface MessageGroupMapping {
  [groupId: string]: {
    participants: string[];
    label?: string;
    avatar?: string;
    updatedAt: string;
  }
}

async function createMessage(userIdentifier: string, groupId: string, message: string): Promise<any> {
  const query = `
  INSERT INTO npwd_messages
  (user_identifier, message, group_id)
  VALUES (?, ?, ?)
  `;
  const [results] = await pool.query(query, [
    userIdentifier,
    message,
    groupId,
  ]);
  return results;
}

async function getMessageGroups(userIdentifier: string): Promise<UnformattedMessageGroup[]> {
  const query = `
  SELECT
    npwd_messages_groups.group_id,
    npwd_messages_groups.participant_identifier,
    npwd_messages_labels.label,
    users.phone_number,
    npwd_phone_contacts.avatar,
    npwd_phone_contacts.display
  FROM npwd_messages_groups
  LEFT OUTER JOIN users on users.identifier = npwd_messages_groups.participant_identifier
  LEFT OUTER JOIN npwd_messages_labels on npwd_messages_labels.group_id = npwd_messages_groups.group_id
  LEFT OUTER JOIN npwd_phone_contacts on npwd_phone_contacts.number = users.phone_number
  WHERE npwd_messages_groups.user_identifier = ? AND npwd_messages_groups.participant_identifier != ?
  ORDER BY npwd_messages_groups.createdAt DESC
  `
  const [results] = await pool.query(query, [ userIdentifier, userIdentifier]);
  return <UnformattedMessageGroup[]>results;
}

async function getMessages(userIdentifier: string, groupId: string): Promise<Message[]> {
  const query = `
  SELECT
	  npwd_messages.id,
    npwd_messages.message,
    npwd_messages.user_identifier,
    npwd_messages.isRead,
    npwd_messages.updatedAt,
    users.phone_number,
    npwd_phone_contacts.display,
    npwd_phone_contacts.avatar
  FROM npwd_messages
  LEFT OUTER JOIN users on users.identifier = npwd_messages.user_identifier
  LEFT OUTER JOIN npwd_phone_contacts on REGEXP_REPLACE(npwd_phone_contacts.number, '[^0-9]', '') = REGEXP_REPLACE(users.phone_number, '[^0-9]', '')
  WHERE npwd_messages.group_id = ?
  ORDER BY createdAt ASC;
  `;
  const [results] = await pool.query(query, [ groupId]);
  const messages = <Message[]>results;
  return messages.map(message => ({
    ...message,
    isMine: message.user_identifier === userIdentifier,
    updatedAt: message.updatedAt.toString(),
  }));
}

async function getConsolidatedMessageGroups(useIdentifier: string): Promise<MessageGroupMapping> {
  const messageGroups = await getMessageGroups(useIdentifier);
  return messageGroups.reduce((mapping: MessageGroupMapping, messageGroup: UnformattedMessageGroup) => {
    const groupId = messageGroup.group_id;
    const displayTerm = messageGroup.display || messageGroup.phone_number || '???';

    if (groupId in mapping) {
      mapping[groupId].participants =  mapping[groupId].participants.concat(displayTerm)
    } else {
      mapping[groupId] = {
        label: messageGroup.label,
        participants: [displayTerm],
        avatar: messageGroup.avatar,
        updatedAt: messageGroup.updatedAt ? messageGroup.updatedAt.toString() : null
      }
    }
    return mapping;
  }, {});
}


async function getFormattedMessageGroups(userIdentifier: string): Promise<MessageGroup[]> {
  const groupMapping = await getConsolidatedMessageGroups(userIdentifier);
  const groupIds = Object.keys(groupMapping);
  return groupIds.map(groupId => {
    const group = groupMapping[groupId];
    return {
      ...group,
      groupId,
      groupDisplay: group.participants.join(', '),
    }
  });
}

async function createLabel(userIdentifier: string, groupId: string, label: string): Promise<any> {
  const query = `
  INSERT INTO npwd_messages_labels
  (user_identifier, group_id, label)
  VALUES (?, ?, ?)
  `;
  await pool.query(query, [ userIdentifier, groupId, label ]);
}

async function createMessageGroup(userIdentifier: string, groupId: string, participantIdentifier: string): Promise<any> {
  const query = `
  INSERT INTO npwd_messages_groups
  (user_identifier, group_id, participant_identifier)
  VALUES (?, ?, ?)
  `;
  const [results] = await pool.query(query, [
    userIdentifier,
    groupId,
    participantIdentifier
  ]);
}

async function getIdentifierFromPhoneNumber(phoneNumber: string): Promise<string> {
  const query = `
    SELECT identifier
    FROM users
    WHERE REGEXP_REPLACE(phone_number, '[^0-9]', '') = ?
    LIMIT 1
  `;
  const [results] = await pool.query(query, [ phoneNumber]);
  const identifiers = <any>results;
  return identifiers[0]['identifier']
}

async function createMessageGroupsFromPhoneNumbers(
  userIdentifier: string,
  phoneNumbers: string[],
  groupLabel: string): Promise<string> {
  const groupId = uuidv4();

  // we check that each phoneNumber exists before we create the group
  const identifiers: string[] = [];
  for (const phoneNumber of phoneNumbers) {
    const identifier = await getIdentifierFromPhoneNumber(phoneNumber)
    identifiers.push(identifier);
  }

  const connection = await pool.getConnection()
  connection.beginTransaction();

  const queryPromises = [
    // create a row that contains ourselves so others can reference it
    createMessageGroup(userIdentifier, groupId, userIdentifier),
    ...identifiers.map(identifier => createMessageGroup(userIdentifier, groupId, identifier))
  ]

  // we allow users to attach labels to name their group chats
  if (groupLabel) {
    queryPromises.push(createLabel(userIdentifier, groupId, groupLabel));
  }

  // wrap this in a transaction to make sure ALL of these INSERTs succeed
  //so we are not left in a situation where only some of the member of the
  // group exist while other are left off.
  const results = withTransaction(queryPromises);
  console.log(results);

  return groupId;
}

onNet(events.MESSAGES_FETCH_MESSAGE_GROUPS, async () => {
  try {
    const _identifier = await useIdentifier();
    const messageGroups = await getFormattedMessageGroups(_identifier);
    emitNet(events.MESSAGES_FETCH_MESSAGE_GROUPS_SUCCESS, getSource(), messageGroups);
  } catch (e) {
    emitNet(events.MESSAGES_FETCH_MESSAGE_GROUPS_FAILED, getSource());
  }
});

onNet(events.MESSAGES_CREATE_MESSAGE_GROUP, async (phoneNumbers: string[], label: string = null) => {
  try {
    console.log(phoneNumbers);
    const _identifier = await useIdentifier();
    await createMessageGroupsFromPhoneNumbers(_identifier, phoneNumbers, label)
    emitNet(events.MESSAGES_CREATE_MESSAGE_GROUP_SUCCESS, getSource());
  } catch (e) {
    emitNet(events.MESSAGES_CREATE_MESSAGE_GROUP_FAILED, getSource());
  }
});

onNet(events.MESSAGES_FETCH_MESSAGES, async (groupId: string) => {
  try {
    const _identifier = await useIdentifier();
    const messages = await getMessages(_identifier, groupId);
    emitNet(events.MESSAGES_FETCH_MESSAGES_SUCCESS, getSource(), messages);
  } catch (e) {
    emitNet(events.MESSAGES_FETCH_MESSAGES_FAILED, getSource());
  }
});

onNet(events.MESSAGES_SEND_MESSAGE, async (groupId: string, message: string) => {
  try {
    const _identifier = await useIdentifier();
    await createMessage(_identifier, groupId, message)
    emitNet(events.MESSAGES_SEND_MESSAGE_SUCCESS, getSource(), groupId);
  } catch (e) {
    emitNet(events.MESSAGES_SEND_MESSAGE_FAILED, getSource());
  }
});