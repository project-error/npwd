import events from '../utils/events';
import {
  CreateMessageBroadcast,
  Message,
  MessageGroup,
  SetMessageRead,
} from '../../phone/src/common/typings/messages';
import { sendMessageEvent } from '../utils/messages';

/**
 * Messages get message groups
 */
RegisterNuiCallbackType(events.MESSAGES_FETCH_MESSAGE_GROUPS);
on(`__cfx_nui:${events.MESSAGES_FETCH_MESSAGE_GROUPS}`, (): void => {
  emitNet(events.MESSAGES_FETCH_MESSAGE_GROUPS);
});

onNet(events.MESSAGES_FETCH_MESSAGE_GROUPS_SUCCESS, (messageGroups: MessageGroup[]): void => {
  sendMessageEvent(events.MESSAGES_FETCH_MESSAGE_GROUPS_SUCCESS, messageGroups);
  emitNet(events.MESSAGES_FETCH_MESSAGE_GROUPS_SUCCESS);
});

onNet(events.MESSAGES_FETCH_MESSAGE_GROUPS_FAILED, () => {
  sendMessageEvent(events.MESSAGES_FETCH_MESSAGE_GROUPS_FAILED);
});

onNet(events.MESSAGES_FETCH_MESSAGE_GROUPS, () => {
  emitNet(events.MESSAGES_FETCH_MESSAGE_GROUPS);
});

/**
 * Messages create message group
 */
RegisterNuiCallbackType(events.MESSAGES_CREATE_MESSAGE_GROUP);
on(
  `__cfx_nui:${events.MESSAGES_CREATE_MESSAGE_GROUP}`,
  ({ phoneNumbers, label }: any, cb: Function): void => {
    emitNet(events.MESSAGES_CREATE_MESSAGE_GROUP, phoneNumbers, label);
    cb();
  },
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
on(`__cfx_nui:${events.MESSAGES_FETCH_MESSAGES}`, ({ groupId }: any, cb: Function): void => {
  emitNet(events.MESSAGES_FETCH_MESSAGES, groupId);
  cb();
});

RegisterNuiCallbackType(events.MESSAGES_SET_MESSAGE_READ);
on(`__cfx_nui:${events.MESSAGES_SET_MESSAGE_READ}`, (data: SetMessageRead, cb: Function) => {
  emitNet(events.MESSAGES_SET_MESSAGE_READ, data.groupId);
  cb();
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
on(`__cfx_nui:${events.MESSAGES_SEND_MESSAGE}`, (data: any, cb: Function) => {
  emitNet(events.MESSAGES_SEND_MESSAGE, data.groupId, data.message, data.groupName);
  cb();
});

onNet(events.MESSAGES_SEND_MESSAGE_SUCCESS, (groupId: string) => {
  sendMessageEvent(events.MESSAGES_SEND_MESSAGE_SUCCESS);
  emitNet(events.MESSAGES_FETCH_MESSAGES, groupId);
});

onNet(events.MESSAGES_SEND_MESSAGE_FAILED, () => {
  sendMessageEvent(events.MESSAGES_SEND_MESSAGE_FAILED);
});

onNet(events.MESSAGES_ACTION_RESULT, (result: any) => {
  sendMessageEvent(events.MESSAGES_ACTION_RESULT, result);
});

onNet(events.MESSAGES_CREATE_MESSAGE_BROADCAST, (result: CreateMessageBroadcast) => {
  sendMessageEvent(events.MESSAGES_CREATE_MESSAGE_BROADCAST, result);
});
