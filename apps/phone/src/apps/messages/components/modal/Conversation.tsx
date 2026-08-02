import React, { useCallback, useState } from 'react';
import { Message, MessageConversation, MessageEvents } from '@typings/messages';
import { MessageBubble } from './MessageBubble';
import fetchNui from '../../../../utils/fetchNui';
import { ServerPromiseResp } from '@typings/common';
import { useConversationId, useSetMessages } from '../../hooks/state';
import { useSnackbar } from '@os/snackbar/hooks/useSnackbar';
import { useNavigate } from 'react-router';
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
  const navigate = useNavigate();
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

        navigate('/messages');
        return;
      }

      if (resp.data.length === 0) {
        setHasMore(false);
        return;
      }

      setHasMore(true);
      setPage((curVal) => curVal + 1);

      setMessages((currVal) => [...resp.data, ...currVal]);
    });
  }, [addAlert, conversationId, setMessages, navigate, t, page, setPage]);

  return (
    <div className="h-full min-h-0">
      <div
        id="scrollableDiv"
        className="flex h-full max-h-[620px] grow flex-col-reverse overflow-auto px-2 py-3"
      >
        <InfiniteScroll
          next={handleNextPage}
          scrollableTarget="scrollableDiv"
          hasMore={hasMore}
          inverse={true}
          loader={
            <div className="flex justify-center py-3">
              <div className="size-6 animate-spin rounded-full border-2 border-keyos-muted/30 border-t-[color:var(--keyos-app-accent)]" />
            </div>
          }
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
