import { mainLogger } from '../sv_logger';

export const messagesLogger = mainLogger.child({ module: 'messages' });

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

export function getIdentifiersFromParticipants(conversationId: string) {
  return conversationId.split('+');
}
