import { getSource } from '../utils/miscUtils';
import { MessageEvents } from '../../../typings/messages';
import MessagesService from './messages.service';
import { messagesLogger } from './messages.utils';
import { onNetPromise } from '../utils/PromiseNetEvents/onNetPromise';

/*onNet(MessageEvents.FETCH_MESSAGE_CONVERSATIONS, async () => {
  const src = getSource();
  MessagesService.handleFetchMessageGroups(src).catch((e) =>
    messagesLogger.error(
      `Error occurred in fetch messag group event (${src}), Error: ${e.message}`,
    ),
  );
});*/

onNetPromise<void, any>(MessageEvents.FETCH_MESSAGE_CONVERSATIONS, async (reqObj, resp) => {
  MessagesService.handleFetchMessageConversations(reqObj, resp).catch((e) => {
    messagesLogger.error(
      `Error occurred in fetch messsage converations (${reqObj.source}), Error: ${e.message}`,
    );
    resp({ status: 'error', errorMsg: 'INTERNAL_ERROR' });
  });
});

onNet(MessageEvents.CREATE_MESSAGE_GROUP, async (phoneNumbers: string[], label: string = null) => {
  const src = getSource();
  MessagesService.handleCreateMessageGroup(src, phoneNumbers, label).catch((e) =>
    messagesLogger.error(
      `Error occurred in create message group event (${src}), Error: ${e.message}`,
    ),
  );
});

onNet(MessageEvents.FETCH_MESSAGES, async (groupId: string) => {
  const src = getSource();
  MessagesService.handleFetchMessages(src, groupId).catch((e) =>
    messagesLogger.error(`Error occurred in fetch messages event (${src}), Error: ${e.message}`),
  );
});

onNet(
  MessageEvents.SEND_MESSAGE,
  async (conversationId: number, message: string, groupName: string) => {
    const src = getSource();
    MessagesService.handleSendMessage(src, conversationId, message).catch((e) =>
      messagesLogger.error(`Error occurred in send message event (${src}), Error: ${e.message}`),
    );
  },
);

onNet(MessageEvents.SET_MESSAGE_READ, async (groupId: string) => {
  const src = getSource();
  MessagesService.handleSetMessageRead(src, groupId).catch((e) =>
    messagesLogger.error(`Error occurred in set message read event (${src}), Error: ${e.message}`),
  );
});
