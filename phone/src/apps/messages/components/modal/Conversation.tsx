import React, { useState } from 'react';
import { Box } from '@material-ui/core';

import { Message, MessageGroup } from '../../../../common/typings/messages';
import MessageInput from '../form/MessageInput';
import useStyles from './modal.styles';
import { MessageImageModal } from './MessageImageModal';
import { useQueryParams } from '../../../../common/hooks/useQueryParams';
import { MessageBubble } from './MessageBubble';

interface IProps {
  activeMessageGroup: MessageGroup;
  messages: Message[];
}

export const CONVERSATION_ELEMENT_ID = 'message-modal-conversation';

const Conversation = ({ activeMessageGroup, messages }: IProps) => {
  const classes = useStyles();
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const query = useQueryParams();
  const referalImage = query?.image || null;

  return (
    <>
      <MessageImageModal
        image={referalImage}
        onClose={() => setImageModalOpen(false)}
        isOpen={imageModalOpen}
        messageGroupId={activeMessageGroup.groupId}
      />
      <Box
        id={CONVERSATION_ELEMENT_ID}
        height='90%'
        display='flex'
        flexDirection='column'
        pb={4}
        className={classes.overflowAutoY}
      >
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            isGroupChat={activeMessageGroup?.isGroupChat}
          />
        ))}
      </Box>
      <MessageInput
        messageGroupId={activeMessageGroup.groupId}
        onAddImageClick={() => setImageModalOpen(true)}
      />
    </>
  );
};

export default Conversation;
