import React, { useCallback, useState } from 'react';
import { Box, CircularProgress } from '@mui/material';

import { Message, MessageConversation, MessageEvents } from '@typings/messages';
import MessageInput from '../form/MessageInput';
import { MessageImageModal } from './MessageImageModal';
import { useQueryParams } from '@common/hooks/useQueryParams';
import { MessageBubble } from './MessageBubble';
import fetchNui from '../../../../utils/fetchNui';
import { ServerPromiseResp } from '@typings/common';
import { useConversationId, useSetMessages } from '../../hooks/state';
import { useSnackbar } from '@os/snackbar/hooks/useSnackbar';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useContactActions } from '../../../contacts/hooks/useContactActions';

interface IProps {
  activeMessageGroup: MessageConversation;
  messages: Message[];
}

export const CONVERSATION_ELEMENT_ID = 'message-modal-conversation';

const Conversation: React.FC<IProps> = ({ activeMessageGroup, messages }) => {
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
  const { getContactByNumber } = useContactActions();

  const conversationContact = getContactByNumber(activeMessageGroup.phoneNumber);

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
    <>
      <Box display="flex" zIndex={1} flexGrow={1} flexDirection="column">
        <MessageImageModal
          image={referalImage}
          onClose={() => setImageModalOpen(false)}
          isOpen={imageModalOpen}
          messageGroup={activeMessageGroup}
        />
        <Box id={CONVERSATION_ELEMENT_ID} style={{ flex: 1, display: 'flex', overflowY: 'auto' }}>
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
                maxHeight: 554,
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
                  <MessageBubble key={message.id} message={message} />
                ))}
              </InfiniteScroll>
            </div>
          </Box>
        </Box>
      </Box>
      <MessageInput
        messageGroupName={conversationContact?.display || activeMessageGroup.phoneNumber}
        messageConversation={activeMessageGroup}
        onAddImageClick={() => setImageModalOpen(true)}
      />
    </>
  );
};

export default Conversation;
