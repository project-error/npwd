import React, { useState } from 'react'
import { Paper, TextField, Button } from '@material-ui/core'
import useStyles from './form.styles';
import SendIcon from '@material-ui/icons/Send';
import Nui from '../../../../os/nui-events/utils/Nui';

export const MessageInput = ({ messageGroupId }) => {
  const classes = useStyles();
  const [ message, setMessage ] = useState('')

  const handleSubmit = () => {
    Nui.send('phone:sendMessage', {
      groupId: messageGroupId, 
      message
    });
    setMessage('');
  }

  return (
    <Paper 
      className={classes.form}
      variant="outlined"
    >
      <TextField 
        value={message}
        onChange={e => setMessage(e.target.value)}
        placeholder="Message..."
        className={classes.input}
        inputProps={{
          className: classes.messagesInput
        }}
      />
      <Button className={classes.sendButton} onClick={handleSubmit}><SendIcon /></Button>
    </Paper>
  )
}
