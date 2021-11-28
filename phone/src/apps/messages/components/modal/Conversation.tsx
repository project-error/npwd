import React, { useCallback, useState } from 'react';
import { Box, CircularProgress } from '@mui/material';

import { Message, MessageConversation, MessageEvents } from '../../../../../../typings/messages';
import MessageInput from '../form/MessageInput';
import useStyles from './modal.styles';
import { MessageImageModal } from './MessageImageModal';
import { useQueryParams } from '../../../../common/hooks/useQueryParams';
import { MessageBubble } from './MessageBubble';
import { fetchNui } from '../../../../utils/fetchNui';
import { ServerPromiseResp } from '../../../../../../typings/common';
import { useConversationId, useSetMessages } from '../../hooks/state';
import { useSnackbar } from '../../../../os/snackbar/hooks/useSnackbar';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import InfiniteScroll from 'react-infinite-scroll-component';

interface IProps {
  activeMessageGroup: MessageConversation;
  messages: Message[];

  onClickDisplay(phoneNumber: string): void;
}

export const CONVERSATION_ELEMENT_ID = 'message-modal-conversation';

const Conversation: React.FC<IProps> = ({ activeMessageGroup, messages, onClickDisplay }) => {
  const classes = useStyles();
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const query = useQueryParams();
  const referalImage = query?.image || null;
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
          message: t('APPS_MESSAGES_FETCHED_MESSAGES_FAILED'),
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
    <Box className={classes.conversationContainer}>
      <MessageImageModal
        image={referalImage}
        onClose={() => setImageModalOpen(false)}
        isOpen={imageModalOpen}
        messageGroupId={activeMessageGroup.conversation_id}
      />
      <Box
        id={CONVERSATION_ELEMENT_ID}
        height="85%"
        pt={6}
        style={{ flex: 1, display: 'flex', overflowY: 'auto' }}
      >
        <Box
          style={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: 'min-content',
            width: '100%',
          }}
        >
          <div
            id="scrollableDiv"
            style={{
              overflow: 'auto',
              display: 'flex',
              flexDirection: 'column-reverse',
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
                <MessageBubble onClickDisplay={onClickDisplay} key={message.id} message={message} />
              ))}
            </InfiniteScroll>
          </div>
        </Box>
      </Box>
      <MessageInput
        messageGroupName={activeMessageGroup.phoneNumber || activeMessageGroup.display}
        messageConversationId={activeMessageGroup.conversation_id}
        onAddImageClick={() => setImageModalOpen(true)}
      />
    </Box>
  );
};

export default Conversation;
