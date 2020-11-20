import events from '../utils/events';
import { pool } from "./db";
import { Message, MessageGroup } from '../../phone/src/common/interfaces/messages';
import { getSource, useIdentifier } from './functions';

interface GroupMapping {
  [channelId: string]: {
    messages: Message[];
    updatedAt: string;
    createdAt: string;
  }
}

interface GroupMessages {
  channelId: string;
  messages: Message[];
  updatedAt: string;
  createdAt: string;
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

async function getMessages(userIdentifier: string): Promise<Message[]> {
  const query = `
  SELECT
    npwd_messages.*,
    users.phone_number,
    npwd_phone_contacts.display,
    npwd_phone_contacts.avatar
  FROM (
    SELECT group_id
      FROM npwd_messages_groups
      WHERE user_identifier = ?
  ) as t
  LEFT OUTER JOIN npwd_messages on t.group_id = npwd_messages.group_id
  LEFT OUTER JOIN users on users.identifier = npwd_messages.user_identifier
  LEFT OUTER JOIN npwd_phone_contacts on npwd_phone_contacts.number = users.phone_number
  WHERE (users.phone_number IS NOT NULL OR npwd_phone_contacts.display IS NOT NULL)
  ORDER BY updatedAt ASC;
  `;
  const [results] = await pool.query(query, [ userIdentifier]);
  const messages = <Message[]>results;
  return messages.map(message => ({
    ...message,
    isMine: message.user_identifier === userIdentifier,
    createdAt: message.createdAt.toString(),
    updatedAt: message.updatedAt.toString(),
  }));
}

async function groupMessagesByGroup(useIdentifier: string): Promise<GroupMapping> {
  const messages = await getMessages(useIdentifier);
  return messages.reduce((mapping: GroupMapping, message: Message) => {
    const groupId = message.group_id;
    if (groupId in mapping) {
      // we sort by updatedAt ASCENDING in the SQL query so we can always assume the
      // first participant added has the lastest updatedAt. Therefore we don't
      // need to updatedAt here
      mapping[groupId].messages = mapping[groupId].messages.concat(message);
    } else {
      mapping[groupId] = {
        messages: [message],
        updatedAt: message.updatedAt,
        createdAt: message.createdAt,
      }
    }
    return mapping;
  }, {});
}

function getGroupDisplayName(userIdentifier: string, messages: Message[]): string {
  return messages.reduce((displayTerms, message) => {
    if (message.user_identifier === userIdentifier) return displayTerms; // don't display our name

    const display = message.display || message.phone_number;
    return displayTerms.includes(display) ? [] : displayTerms.concat(display)
  }, []).join(', ');
}

async function getFormattedMessages(userIdentifier: string): Promise<MessageGroup[]> {
  const groupMapping = await groupMessagesByGroup(userIdentifier);
  const groups = Object.keys(groupMapping);
  return groups.map(group => {
    return {
      ...groupMapping[group],
      groupId: group,
      groupDisplay: getGroupDisplayName(userIdentifier, groupMapping[group].messages)
    }
  });
}

onNet(events.MESSAGES_FETCH_MESSAGES, async () => {
  try {
    const _identifier = await useIdentifier();
    const messages = await getFormattedMessages(_identifier);
    emitNet(events.MESSAGES_FETCH_MESSAGES_SUCCESS, getSource(), messages);
  } catch (e) {
    emitNet(events.MESSAGES_FETCH_MESSAGES_FAILED, getSource());
  }
});

onNet(events.MESSAGES_SEND_MESSAGE, async (groupId: string, message: string) => {
  try {
    const _identifier = await useIdentifier();
    const result = await createMessage(_identifier, groupId, message)
    emitNet(events.MESSAGES_SEND_MESSAGE_SUCCESS, getSource(), result);
  } catch (e) {
    emitNet(events.MESSAGES_SEND_MESSAGE_FAILED, getSource());
  }
});
