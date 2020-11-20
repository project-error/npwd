import events from '../utils/events';
import { Message } from '../../phone/src/common/interfaces/messages';
import { sendMessageEvent } from '../utils/messages';


/**
 * Twitter fetch messages
 */
RegisterNuiCallbackType(events.MESSAGES_FETCH_MESSAGES);
on(`__cfx_nui:${events.MESSAGES_FETCH_MESSAGES}`, () => {
  emitNet(events.MESSAGES_FETCH_MESSAGES);
});

onNet(events.MESSAGES_FETCH_MESSAGES_SUCCESS, (messages: Message[]) => {
  sendMessageEvent(events.MESSAGES_FETCH_MESSAGES_SUCCESS, messages);
});

onNet(events.MESSAGES_FETCH_MESSAGES_FAILED, () => {
  sendMessageEvent(events.MESSAGES_FETCH_MESSAGES_FAILED);
});

// fetch messages on client launch
emitNet(events.MESSAGES_FETCH_MESSAGES);


/**
 * Messages send message
 */
RegisterNuiCallbackType(events.MESSAGES_SEND_MESSAGE);
on(`__cfx_nui:${events.MESSAGES_SEND_MESSAGE}`, (data: any) => {
  emitNet(events.MESSAGES_SEND_MESSAGE, data.groupId, data.message);
});

onNet(events.MESSAGES_SEND_MESSAGE_SUCCESS, (result: any) => {
  console.log(result);
  sendMessageEvent(events.MESSAGES_SEND_MESSAGE_SUCCESS, result);
  emitNet(events.MESSAGES_FETCH_MESSAGES);
});

onNet(events.MESSAGES_SEND_MESSAGE_FAILED, () => {
  sendMessageEvent(events.MESSAGES_SEND_MESSAGE_FAILED);
});
