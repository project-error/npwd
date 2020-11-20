import React, { useEffect } from 'react'
import { Slide, Paper, Button, Typography } from '@material-ui/core'
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import useStyles from './modal.styles';
import useMessages from '../../hooks/useMessages';
import useModals from '../../hooks/useModals';
import Conversation, { CONVERSATION_ELEMENT_ID } from './Conversation';

export const MessageModal = () => {
  const classes = useStyles();
  const { messages, setMessages } = useMessages();
  const { activeMessageGroup, setActiveMessageGroup } = useModals();

  const closeModal = () => {
    setActiveMessageGroup(null);
    setMessages(null);
  }

  useEffect(() => {
    // when we get a new message group we should scroll to the
    // bottom to show the latest messages
    if (activeMessageGroup) {
      const element = document.getElementById(CONVERSATION_ELEMENT_ID);
      if (element) {
        element.scrollTop = element.scrollHeight;
      }
    }
  }, [ messages?.length]);

  const isOpen = activeMessageGroup !== null;
  
  return (
    <Slide direction="left" in={isOpen}>
      <Paper className={isOpen ? classes.modalRoot : classes.modalHide}>
        <Paper className={classes.topContainer}>
          <Button onClick={closeModal}><ArrowBackIcon fontSize="large" /></Button>
          <Typography variant="h5" className={classes.groupdisplay} >
            {activeMessageGroup ? activeMessageGroup.groupDisplay : ''}
          </Typography>
        </Paper>
        {messages ? (
          <Conversation
            messages={messages}
            activeMessageGroupId={activeMessageGroup?.groupId}
          />
          ) : <h1>LOADING</h1>}
      </Paper>
    </Slide>
  )
}
