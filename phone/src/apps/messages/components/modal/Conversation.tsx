import React from 'react';
import { Paper } from '@material-ui/core'

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
    return (
      <>
        <div id={CONVERSATION_ELEMENT_ID} className={classes.messageList}>
          {messages.map((message) => (
              <div key={message.id} className={classes.messageContainer}>
              <Paper className={message.isMine ? classes.sourceSms : classes.sms} variant="outlined">
                  {message.message}
              </Paper>
              </div>
          ))}
        </div>
        <MessageInput messageGroupId={activeMessageGroupId} />
      </>
    );
}

export default Conversation;
