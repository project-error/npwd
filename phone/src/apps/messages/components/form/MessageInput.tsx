import React, { FormEvent, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { Paper, TextField, Button } from '@material-ui/core'
import useStyles from './form.styles';
import SendIcon from '@material-ui/icons/Send';
import Nui from '../../../../os/nui-events/utils/Nui';

interface IProps {
  messageGroupId: string | undefined;
}

const MessageInput = ({ messageGroupId }: IProps) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const [ message, setMessage ] = useState('')

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    Nui.send('phone:sendMessage', {
      groupId: messageGroupId, 
      message
    });
    setMessage('');
  }

  if (!messageGroupId) return null;

  return (
    <Paper className={classes.paper} variant="outlined" >
      <form className={classes.form} onSubmit={handleSubmit}>
        <TextField
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder={t("APPS_MESSAGES_NEW_MESSAGE")}
          className={classes.input}
          inputProps={{
            className: classes.messagesInput
          }}
        />
        <Button className={classes.sendButton} type="submit" >
          <SendIcon />
        </Button>
      </form>
    </Paper>
  )
}

export default MessageInput;