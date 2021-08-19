import { getSource } from '../utils/miscUtils';
import { Message, MessageEvents, PreDBMessage } from '../../../typings/messages';
import MessagesService from './messages.service';
import { messagesLogger } from './messages.utils';
import { onNetPromise } from '../utils/PromiseNetEvents/onNetPromise';

onNetPromise<void, any>(MessageEvents.FETCH_MESSAGE_CONVERSATIONS, async (reqObj, resp) => {
  MessagesService.handleFetchMessageConversations(reqObj, resp).catch((e) => {
    messagesLogger.error(
      `Error occurred in fetch messsage converations (${reqObj.source}), Error: ${e.message}`,
    );
    resp({ status: 'error', errorMsg: 'INTERNAL_ERROR' });
  });
});

onNetPromise<{ targetNumber: string }, boolean>(
  MessageEvents.CREATE_MESSAGE_CONVERSATION,
  async (reqObj, resp) => {
    MessagesService.handleCreateMessageConversation(reqObj, resp).catch((e) => {
      messagesLogger.error(
        `Error occurred on creating messsage converations (${reqObj.source}), Error: ${e.message}`,
      );
      resp({ status: 'error', errorMsg: 'INTERNAL_ERROR' });
    });
  },
);

onNetPromise<{ conversationId: string }, Message[]>(
  MessageEvents.FETCH_MESSAGES,
  async (reqObj, resp) => {
    MessagesService.handleFetchMessages(reqObj, resp).catch((e) => {
      messagesLogger.error(
        `Error occurred in fetch messages (${reqObj.source}), Error: ${e.message}`,
      );
      resp({ status: 'error', errorMsg: 'INTERNAL_ERROR' });
    });
  },
);

onNetPromise<PreDBMessage, void>(MessageEvents.SEND_MESSAGE, async (reqObj, resp) => {
  MessagesService.handleSendMessage(reqObj, resp).catch((e) => {
    messagesLogger.error(
      `Error occurred while sending messsage (${reqObj.source}), Error: ${e.message}`,
    );
    resp({ status: 'error', errorMsg: 'INTERNAL_ERROR' });
  });
});

onNet(MessageEvents.SET_MESSAGE_READ, async (groupId: string) => {
  const src = getSource();
  MessagesService.handleSetMessageRead(src, groupId).catch((e) =>
    messagesLogger.error(`Error occurred in set message read event (${src}), Error: ${e.message}`),
  );
});
