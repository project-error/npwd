import { getSource } from '../utils/miscUtils';
import {
  DeleteConversationRequest,
  Message,
  MessageConversation,
  MessageEvents,
  PreDBConversation,
  PreDBMessage,
} from '../../../typings/messages';
import MessagesService from './messages.service';
import { messagesLogger } from './messages.utils';
import { onNetPromise } from '../lib/PromiseNetEvents/onNetPromise';
import { OnMessageExportMap } from './middleware/onMessage';

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

onNetPromise<PreDBConversation, MessageConversation>(
  MessageEvents.CREATE_MESSAGE_CONVERSATION,
  async (reqObj, resp) => {
    MessagesService.handleCreateMessageConversation(reqObj, resp).catch((e) => {
      messagesLogger.error(
        `Error occurred on creating message conversation (${reqObj.source}), Error: ${e.message}`,
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
  MessagesService.handleSendMessage(reqObj, resp)
    .then(async () => {
      // Get the phone numbers from conversation list since front end seems to be borked
      const numbers = reqObj.data.conversationList
        .split('+')
        .filter((x) => x !== reqObj.data.sourcePhoneNumber);

      // Allow only messages in 1 on 1 DM and not from group chats
      if (numbers.length > 1) return;
      const tgtPhoneNumber = numbers[0];

      const funcRef = OnMessageExportMap.get(tgtPhoneNumber);
      if (funcRef) {
        try {
          await funcRef({ data: { ...reqObj.data, tgtPhoneNumber }, source: reqObj.source });
        } catch (e) {
          messagesLogger.error(
            `Failed to find a callback reference for onMessage. Probably because the resource(s) using the export was stopped or restarted. Please restart said resource(s). Error: ${e.message}`,
          );
        }
      }
    })
    .catch((e) => {
      messagesLogger.error(
        `Error occurred while sending message (${reqObj.source}), Error: ${e.message}`,
      );
      resp({ status: 'error', errorMsg: 'INTERNAL_ERROR' });
    });
});

onNetPromise<DeleteConversationRequest, void>(
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

onNetPromise<number, void>(MessageEvents.SET_MESSAGE_READ, async (reqObj, resp) => {
  const src = getSource();
  MessagesService.handleSetMessageRead(reqObj, resp).catch((e) =>
    messagesLogger.error(`Error occurred in set message read event (${src}), Error: ${e.message}`),
  );
});

onNetPromise(MessageEvents.GET_MESSAGE_LOCATION, async (reqObj, resp) => {
  const src = getSource();
  MessagesService.handleGetLocation(reqObj, resp).catch((e) => {
    messagesLogger.error(`Error occurred in get location event (${src}), Error: ${e.message}`);
  });
});
