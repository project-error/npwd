import React, { useEffect } from 'react'
import { Slide, Paper, Button } from '@material-ui/core'
import useStyles from './modal.styles';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import { useMessages } from '../../hooks/useMessages';
import { MessageInput } from '../form/MessageInput';

const LIST_ID = 'message-modal-list';

export const MessageModal = () => {
  const classes = useStyles();
  const { messages, activeMessageGroupId, setActiveMessageGroupId } = useMessages();

  useEffect(() => {
    // when we get a new message group we should scroll to the
    // bottom to show the latest messages
    if (activeMessageGroupId) {
      const element = document.getElementById(LIST_ID);
      if (element) {
        element.scrollTop = element.scrollHeight;
      }
    }
  }, [activeMessageGroupId]);

  const closeModal = () => setActiveMessageGroupId(null);
  const isOpen = activeMessageGroupId !== null;
  const activeMessageGroup = messages.find(messageGroup => messageGroup.groupId === activeMessageGroupId);
  const activeMessages = activeMessageGroup ? activeMessageGroup.messages : [];
  
  return (
    <Slide direction="left" in={isOpen}>
      <Paper className={activeMessageGroupId ? classes.modalRoot : classes.modalHide}>
        <Button onClick={closeModal}><ArrowBackIcon /></Button>
          <div id={LIST_ID} className={classes.messageList}>
            {activeMessages.map((message) => (
              <>
                <div className={classes.messageContainer}>
                  <Paper className={message.isMine ? classes.sourceSms : classes.sms} variant="outlined">
                    {message.content}
                  </Paper>
                </div>
              </>
            ))}
          </div>
        <MessageInput messageGroup={activeMessageGroupId} />
      </Paper>
    </Slide>
  )
}
