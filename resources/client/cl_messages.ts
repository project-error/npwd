import { CreateMessageBroadcast, MessageEvents } from '../../typings/messages';
import { sendMessageEvent } from '../utils/messages';
import { RegisterNuiProxy } from './cl_utils';

RegisterNuiProxy(MessageEvents.FETCH_MESSAGE_CONVERSATIONS);
RegisterNuiProxy(MessageEvents.FETCH_MESSAGES);
RegisterNuiProxy(MessageEvents.CREATE_MESSAGE_CONVERSATION);
RegisterNuiProxy(MessageEvents.SEND_MESSAGE);
RegisterNuiProxy(MessageEvents.SET_MESSAGE_READ);

onNet(MessageEvents.CREATE_MESSAGE_BROADCAST, (result: CreateMessageBroadcast) => {
  sendMessageEvent(MessageEvents.CREATE_MESSAGE_BROADCAST, result);
});
