import events from '../utils/events';

RegisterNuiCallbackType(events.MESSAGES_SEND_MESSAGE);
on(`__cfx_nui:${events.MESSAGES_SEND_MESSAGE}`, (data: any) => {
  emitNet(events.MESSAGES_SEND_MESSAGE, data);
})