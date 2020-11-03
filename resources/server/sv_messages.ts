import events from '../utils/events';
import { Message } from '../../phone/src/common/interfaces/messages';
import { useIdentifier } from './functions';

async function sendMessage(message: Message, identifier: string): Promise<any> {

}

onNet(events.MESSAGES_SEND_MESSAGE, async (message: Message) => {
  const _identifier = await useIdentifier()
  sendMessage(message, _identifier)
})