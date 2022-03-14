import { Message, MessageEvents } from '../../../typings/messages';

global.exports('emitRconMessage', (src: number, data: Message) => {
  emitNet(MessageEvents.SEND_MESSAGE_SUCCESS, src, data);
});
