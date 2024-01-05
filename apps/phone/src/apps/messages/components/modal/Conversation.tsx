import React, { useCallback, useState } from 'react';
import { CircularProgress } from '@mui/material';
import { Message, MessageConversation, MessageEvents } from '@typings/messages';
import { MessageBubble } from './MessageBubble';
import fetchNui from '../../../../utils/fetchNui';
import { ServerPromiseResp } from '@typings/common';
import { useConversationId, useSetMessages } from '../../hooks/state';
import { useSnackbar } from '@os/snackbar/hooks/useSnackbar';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import InfiniteScroll from 'react-infinite-scroll-component';

interface IProps {
  activeMessageGroup: MessageConversation;
  messages: Message[];
  isVoiceEnabled: boolean;
}

export const CONVERSATION_ELEMENT_ID = 'message-modal-conversation';

const Conversation: React.FC<IProps> = ({ activeMessageGroup, messages, isVoiceEnabled }) => {
  const conversationId = useConversationId();
  const { addAlert } = useSnackbar();
  const history = useHistory();
  const setMessages = useSetMessages();
  const [t] = useTranslation();
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(!!messages.length);

  const handleNextPage = useCallback(() => {
    fetchNui<ServerPromiseResp<Message[]>>(MessageEvents.FETCH_MESSAGES, {
      conversationId: conversationId,
      page,
    }).then((resp) => {
      if (resp.status !== 'ok') {
        addAlert({
          message: t('MESSAGES.FEEDBACK.FETCHED_MESSAGES_FAILED'),
          type: 'error',
        });

        return history.push('/messages');
      }

      if (resp.data.length === 0) {
        setHasMore(false);
        return;
      }

      setHasMore(true);
      setPage((curVal) => curVal + 1);

      setMessages((currVal) => [...resp.data, ...currVal]);
    });
  }, [addAlert, conversationId, setMessages, history, t, page, setPage]);

  return (
    <div className="h-full">
      <div
        id="scrollableDiv"
        style={{
          overflow: 'auto',
          maxHeight: 620,
          display: 'flex',
          flexDirection: 'column-reverse',
          flexGrow: 1,
        }}
      >
        <InfiniteScroll
          next={handleNextPage}
          scrollableTarget="scrollableDiv"
          hasMore={hasMore}
          inverse={true}
          loader={<CircularProgress />}
          dataLength={messages.length}
        >
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default Conversation;
