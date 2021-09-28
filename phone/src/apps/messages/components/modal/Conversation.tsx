import React, { useState } from 'react';
import { Box } from '@mui/material';

import { Message, MessageConversation, MessageEvents } from '../../../../../../typings/messages';
import MessageInput from '../form/MessageInput';
import useStyles from './modal.styles';
import { MessageImageModal } from './MessageImageModal';
import { useQueryParams } from '../../../../common/hooks/useQueryParams';
import { MessageBubble } from './MessageBubble';
import { InfiniteScroll } from '../../../../ui/components/InfinteScroll';
import { fetchNui } from '../../../../utils/fetchNui';
import { ServerPromiseResp } from '../../../../../../typings/common';
import { useConversationId, useSetMessages } from '../../hooks/state';
import { useSnackbar } from '../../../../ui/hooks/useSnackbar';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();

  const handleNextPage = (page: number) => {
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

      setMessages((currVal) => [...resp.data, ...currVal]);
    });
  };

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
          <InfiniteScroll nextPage={handleNextPage} inverse={true} nextPageNumber={20}>
            {messages.map((message) => (
              <MessageBubble onClickDisplay={onClickDisplay} key={message.id} message={message} />
            ))}
          </InfiniteScroll>
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
