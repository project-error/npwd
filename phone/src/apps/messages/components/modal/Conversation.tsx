import React, { useState } from 'react';
import { Paper, Typography } from '@material-ui/core';

import { Message, MessageGroup } from '../../../../common/typings/messages';
import MessageInput from '../form/MessageInput';
import useStyles from './modal.styles';
import { MessageImageModal } from './MessageImageModal';
import { useQueryParams } from '../../../../common/hooks/useQueryParams';

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

  const isImage = (url) => {
    return /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|png|jpeg|gif)/g.test(url);
  };

  return (
    <>
      <MessageImageModal
        image={referalImage}
        onClose={() => setImageModalOpen(false)}
        isOpen={imageModalOpen}
        messageGroupId={activeMessageGroup.groupId}
      />
      <div id={CONVERSATION_ELEMENT_ID} className={classes.messageList}>
        {messages.map((message) => (
          <div key={message.id} className={classes.messageContainer}>
            <Paper
              className={message.isMine ? classes.sourceSms : classes.sms}
              variant='outlined'
            >
              {isImage(message.message) ? (
                <img
                  src={message.message}
                  className={classes.imageMessage}
                  alt='multimedia'
                />
              ) : (
                <div>{message.message}</div>
              )}
              <Typography variant='subtitle1' color='secondary'>
                {activeMessageGroup.isGroupChat && !message.isMine
                  ? message.display || message.phone_number
                  : null}
              </Typography>
            </Paper>
          </div>
        ))}
      </div>
      <MessageInput
        messageGroupId={activeMessageGroup.groupId}
        onAddImageClick={() => setImageModalOpen(true)}
      />
    </>
  );
};

export default Conversation;
