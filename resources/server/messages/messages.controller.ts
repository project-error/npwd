import { getSource } from '../utils/miscUtils';
import {
  Message,
  MessageConversation,
  MessageEvents,
  PreDBMessage,
} from '../../../typings/messages';
import MessagesService from './messages.service';
import { messagesLogger } from './messages.utils';
import { onNetPromise } from '../utils/PromiseNetEvents/onNetPromise';

onNetPromise<void, MessageConversation[]>(
  MessageEvents.FETCH_MESSAGE_CONVERSATIONS,
  async (reqObj, resp) => {
    MessagesService.handleFetchMessageConversations(reqObj, resp).catch((e) => {
      messagesLogger.error(
        `Error occurred in fetch message conversations (${reqObj.source}), Error: ${e.message}`,
      );
      resp({ status: 'error', errorMsg: 'INTERNAL_ERROR' });
    });
  },
);

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

onNetPromise<{ conversationId: string; page: number }, Message[]>(
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

onNetPromise<PreDBMessage, Message>(MessageEvents.SEND_MESSAGE, async (reqObj, resp) => {
  MessagesService.handleSendMessage(reqObj, resp).catch((e) => {
    messagesLogger.error(
      `Error occurred while sending message (${reqObj.source}), Error: ${e.message}`,
    );
    resp({ status: 'error', errorMsg: 'INTERNAL_ERROR' });
  });
});

onNetPromise<{ conversationId: string }, void>(
  MessageEvents.DELETE_CONVERSATION,
  async (reqObj, resp) => {
    MessagesService.handleDeleteConversation(reqObj, resp).catch((e) => {
      messagesLogger.error(
        `Error occurred while deleting conversation (${reqObj.source}), Error: ${e.message}`,
      );
      resp({ status: 'error', errorMsg: 'INTERNAL_ERROR' });
    });
  },
);

onNetPromise<Message, void>(MessageEvents.DELETE_MESSAGE, async (reqObj, resp) => {
  MessagesService.handleDeleteMessage(reqObj, resp).catch((e) => {
    messagesLogger.error(
      `Error occurred while deleting message (${reqObj.source}), Error: ${e.message}`,
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
