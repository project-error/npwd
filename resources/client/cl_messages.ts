import events from '../utils/events';
import { Message, MessageGroup } from '../../phone/src/common/typings/messages';
import { sendMessageEvent } from '../utils/messages';

/**
 * Messages get message groups
 */
RegisterNuiCallbackType(events.MESSAGES_FETCH_MESSAGE_GROUPS);
on(`__cfx_nui:${events.MESSAGES_FETCH_MESSAGE_GROUPS}`, (): void => {
  emitNet(events.MESSAGES_FETCH_MESSAGE_GROUPS);
});

onNet(
  events.MESSAGES_FETCH_MESSAGE_GROUPS_SUCCESS,
  (messageGroups: MessageGroup[]): void => {
    sendMessageEvent(
      events.MESSAGES_FETCH_MESSAGE_GROUPS_SUCCESS,
      messageGroups
    );
    emitNet(events.MESSAGES_FETCH_MESSAGE_GROUPS_SUCCESS);
  }
);

onNet(events.MESSAGES_FETCH_MESSAGE_GROUPS_FAILED, () => {
  sendMessageEvent(events.MESSAGES_FETCH_MESSAGE_GROUPS_FAILED);
});

// fetch message groups on client launch
emitNet(events.MESSAGES_FETCH_MESSAGE_GROUPS);

/**
 * Messages create message group
 */
RegisterNuiCallbackType(events.MESSAGES_CREATE_MESSAGE_GROUP);
on(
  `__cfx_nui:${events.MESSAGES_CREATE_MESSAGE_GROUP}`,
  ({ phoneNumbers, label }: any): void => {
    emitNet(events.MESSAGES_CREATE_MESSAGE_GROUP, phoneNumbers, label);
  }
);

onNet(events.MESSAGES_CREATE_MESSAGE_GROUP_SUCCESS, (result: any): void => {
  sendMessageEvent(events.MESSAGES_CREATE_MESSAGE_GROUP_SUCCESS, result);
  emitNet(events.MESSAGES_FETCH_MESSAGE_GROUPS);
});

onNet(events.MESSAGES_CREATE_MESSAGE_GROUP_FAILED, (result: any): void => {
  sendMessageEvent(events.MESSAGES_CREATE_MESSAGE_GROUP_FAILED, result);
});

/**
 * Messages fetch messages
 */
RegisterNuiCallbackType(events.MESSAGES_FETCH_MESSAGES);
on(`__cfx_nui:${events.MESSAGES_FETCH_MESSAGES}`, ({ groupId }: any): void => {
  emitNet(events.MESSAGES_FETCH_MESSAGES, groupId);
});

onNet(events.MESSAGES_FETCH_MESSAGES_SUCCESS, (messages: Message[]): void => {
  sendMessageEvent(events.MESSAGES_FETCH_MESSAGES_SUCCESS, messages);
});

onNet(events.MESSAGES_FETCH_MESSAGES_FAILED, (): void => {
  sendMessageEvent(events.MESSAGES_FETCH_MESSAGES_FAILED);
});

/**
 * Messages send message
 */
RegisterNuiCallbackType(events.MESSAGES_SEND_MESSAGE);
on(`__cfx_nui:${events.MESSAGES_SEND_MESSAGE}`, (data: any) => {
  emitNet(events.MESSAGES_SEND_MESSAGE, data.groupId, data.message);
});

onNet(events.MESSAGES_SEND_MESSAGE_SUCCESS, (groupId: string) => {
  sendMessageEvent(events.MESSAGES_SEND_MESSAGE_SUCCESS);
  emitNet(events.MESSAGES_FETCH_MESSAGES, groupId);
});

onNet(events.MESSAGES_SEND_MESSAGE_FAILED, () => {
  sendMessageEvent(events.MESSAGES_SEND_MESSAGE_FAILED);
});
