import React from 'react';
import { Paper, Typography } from '@material-ui/core'

import { Message } from '../../../../common/interfaces/messages';
import MessageInput from '../form/MessageInput';
import useStyles from './modal.styles';

interface IProps {
  activeMessageGroupId: string | undefined;
  messages: Message[]
}

export const CONVERSATION_ELEMENT_ID = 'message-modal-conversation';

const Conversation = ({ activeMessageGroupId, messages }: IProps) => {
    const classes = useStyles();

    const uniqueAuthors = Array.from(new Set(messages.map(message => message.display)));
    const isGroupChat = uniqueAuthors.length > 2;

    return (
      <>
        <div id={CONVERSATION_ELEMENT_ID} className={classes.messageList}>
          {messages.map((message) => (
              <div key={message.id} className={classes.messageContainer}>
                <Paper className={message.isMine ? classes.sourceSms : classes.sms} variant="outlined">
                  <div>{message.message}</div>
                  <Typography variant="subtitle1" color="secondary" >
                    {isGroupChat && !message.isMine ? message.display || message.phone_number : null}
                  </Typography>
                </Paper>
              </div>
          ))}
        </div>
        <MessageInput messageGroupId={activeMessageGroupId} />
      </>
    );
}

export default Conversation;
