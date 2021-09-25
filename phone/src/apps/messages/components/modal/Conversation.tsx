import React, { useState } from 'react';
import { Box } from '@mui/material';

import { Message, MessageConversation } from '../../../../../../typings/messages';
import MessageInput from '../form/MessageInput';
import useStyles from './modal.styles';
import { MessageImageModal } from './MessageImageModal';
import { useQueryParams } from '../../../../common/hooks/useQueryParams';
import { MessageBubble } from './MessageBubble';
import useFetchMessages from '../../hooks/useFetchMessages';

interface IProps {
  activeMessageGroup: MessageConversation;
  messages: Message[];
  onClickDisplay(phoneNumber: string): void;
}

export const CONVERSATION_ELEMENT_ID = 'message-modal-conversation';

const Conversation = ({ activeMessageGroup, messages, onClickDisplay }: IProps) => {
  const classes = useStyles();
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const query = useQueryParams();
  const referalImage = query?.image || null;

  const [page, setPage] = useState<number>(0);
  const { loading } = useFetchMessages(page);
  const loader = useRef(null);

  const handleObserver = useCallback((entries) => {
    const target = entries[0];
    if (target.isIntersecting) {
      setPage((prev) => prev + 20);
    }
  }, []);

  useEffect(() => {
    if (messages.length >= 20) {
      const option = {
        root: null,
        rootMargin: '25px',
        threshold: 0,
      };

      const observer = new IntersectionObserver(handleObserver, option);
      if (loader.current) observer.observe(loader.current);
    }
  }, [handleObserver, messages]);

  return (
    <div className={classes.conversationContainer}>
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
          <div ref={loader} />
          {loading && (
            <Box mt={2} display="flex" justifyContent="center">
              <CircularProgress />
            </Box>
          )}
          {messages.map((message) => (
            <MessageBubble onClickDisplay={onClickDisplay} key={message.id} message={message} />
          ))}
        </Box>
      </Box>
      <MessageInput
        messageGroupName={activeMessageGroup.phoneNumber || activeMessageGroup.display}
        messageConversationId={activeMessageGroup.conversation_id}
        onAddImageClick={() => setImageModalOpen(true)}
      />
    </div>
  );
};

export default Conversation;
