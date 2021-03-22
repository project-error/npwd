import {
  CreateMessageBroadcast,
  Message,
  MessageEvents,
  MessageGroup,
  SetMessageRead,
} from '../../typings/messages';
import { sendMessageEvent } from '../utils/messages';

/**
 * Messages get message groups
 */
RegisterNuiCallbackType(MessageEvents.FETCH_MESSAGE_GROUPS);
on(`__cfx_nui:${MessageEvents.FETCH_MESSAGE_GROUPS}`, (): void => {
  emitNet(MessageEvents.FETCH_MESSAGE_GROUPS);
});

onNet(MessageEvents.FETCH_MESSAGE_GROUPS_SUCCESS, (messageGroups: MessageGroup[]): void => {
  sendMessageEvent(MessageEvents.FETCH_MESSAGE_GROUPS_SUCCESS, messageGroups);
  emitNet(MessageEvents.FETCH_MESSAGE_GROUPS_SUCCESS);
});

onNet(MessageEvents.FETCH_MESSAGE_GROUPS_FAILED, () => {
  sendMessageEvent(MessageEvents.FETCH_MESSAGE_GROUPS_FAILED);
});

onNet(MessageEvents.FETCH_MESSAGE_GROUPS, () => {
  emitNet(MessageEvents.FETCH_MESSAGE_GROUPS);
});

/**
 * Messages create message group
 */
RegisterNuiCallbackType(MessageEvents.CREATE_MESSAGE_GROUP);
on(
  `__cfx_nui:${MessageEvents.CREATE_MESSAGE_GROUP}`,
  ({ phoneNumbers, label }: any, cb: Function): void => {
    emitNet(MessageEvents.CREATE_MESSAGE_GROUP, phoneNumbers, label);
    cb();
  },
);

onNet(MessageEvents.CREATE_MESSAGE_GROUP_SUCCESS, (result: any): void => {
  sendMessageEvent(MessageEvents.CREATE_MESSAGE_GROUP_SUCCESS, result);
  emitNet(MessageEvents.FETCH_MESSAGE_GROUPS);
});

onNet(MessageEvents.CREATE_MESSAGE_GROUP_FAILED, (result: any): void => {
  sendMessageEvent(MessageEvents.CREATE_MESSAGE_GROUP_FAILED, result);
});

/**
 * Messages fetch messages
 */
RegisterNuiCallbackType(MessageEvents.FETCH_MESSAGES);
on(`__cfx_nui:${MessageEvents.FETCH_MESSAGES}`, ({ groupId }: any, cb: Function): void => {
  emitNet(MessageEvents.FETCH_MESSAGES, groupId);
  cb();
});

RegisterNuiCallbackType(MessageEvents.SET_MESSAGE_READ);
on(`__cfx_nui:${MessageEvents.SET_MESSAGE_READ}`, (data: SetMessageRead, cb: Function) => {
  emitNet(MessageEvents.SET_MESSAGE_READ, data.groupId);
  cb();
});

onNet(MessageEvents.FETCH_MESSAGES_SUCCESS, (messages: Message[]): void => {
  sendMessageEvent(MessageEvents.FETCH_MESSAGES_SUCCESS, messages);
});

onNet(MessageEvents.FETCH_MESSAGES_FAILED, (): void => {
  sendMessageEvent(MessageEvents.FETCH_MESSAGES_FAILED);
});

/**
 * Messages send message
 */
RegisterNuiCallbackType(MessageEvents.SEND_MESSAGE);
on(`__cfx_nui:${MessageEvents.SEND_MESSAGE}`, (data: any, cb: Function) => {
  emitNet(MessageEvents.SEND_MESSAGE, data.groupId, data.message, data.groupName);
  cb();
});

onNet(MessageEvents.SEND_MESSAGE_SUCCESS, (groupId: string) => {
  sendMessageEvent(MessageEvents.SEND_MESSAGE_SUCCESS);
  emitNet(MessageEvents.FETCH_MESSAGES, groupId);
});

onNet(MessageEvents.SEND_MESSAGE_FAILED, () => {
  sendMessageEvent(MessageEvents.SEND_MESSAGE_FAILED);
});

onNet(MessageEvents.ACTION_RESULT, (result: any) => {
  sendMessageEvent(MessageEvents.ACTION_RESULT, result);
});

onNet(MessageEvents.CREATE_MESSAGE_BROADCAST, (result: CreateMessageBroadcast) => {
  sendMessageEvent(MessageEvents.CREATE_MESSAGE_BROADCAST, result);
});
