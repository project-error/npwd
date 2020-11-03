import React, { useState } from 'react'
import { Slide, Paper, Button } from '@material-ui/core'
import useStyles from './modal.styles';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import { useMessages } from '../../hooks/useMessages';
import { MessageInput } from '../form/MessageInput';
import { useMessageModal } from '../../hooks/useMessageModal';

export const MessageModal = () => {
  const classes = useStyles();
  const message = useMessages();

  const {messageModal, setMessageModal} = useMessageModal()
  
  return (
    <Slide direction="left" in={messageModal}>
      <Paper className={messageModal ? classes.modalRoot : classes.modalHide}>
        <Button onClick={() => setMessageModal(false)}><ArrowBackIcon /></Button>
        {message.map((message) => (
          <>
          <Paper>{message.name}</Paper>
            {message.messages.map((sms) => (
              <div className={classes.messageContainer}>
                <Paper className={sms.source == 'chip' ? classes.sourceSms : classes.sms} variant="elevation">
                  <p>{sms.sms}</p>
                </Paper>
              </div>
            ))}
          </>
        ))}
        <MessageInput key={message.id} {...message}/>
      </Paper>
    </Slide>
  )
}
