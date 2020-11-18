import React, { useState } from 'react'
import { Slide, Paper, Button } from '@material-ui/core'
import useStyles from './modal.styles';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import { useMessages } from '../../hooks/useMessages';
import { MessageInput } from '../form/MessageInput';
import { useMessageModal } from '../../hooks/useMessageModal';

export const MessageModal = () => {
  const classes = useStyles();
  const {messages, setMessages} = useMessages();

  const {messageModal, setMessageModal} = useMessageModal()

  const closeModal = () => {
    setMessageModal(false)
  }
  
  return (
    <Slide direction="left" in={messageModal}>
      <Paper className={messageModal ? classes.modalRoot : classes.modalHide}>
        <Button onClick={closeModal}><ArrowBackIcon /></Button>
          {messages.map((message) => (
          <>
            <div className={classes.messageContainer}>
              <Paper className={message.sender == 'chip' ? classes.sourceSms : classes.sms} variant="outlined">
                <p>{message.sms}</p>
              </Paper>
            </div>
          </>
        ))}
        <MessageInput key={messages.id} {...messages}/>
      </Paper>
    </Slide>
  )
}
