import React, { useState } from 'react'
import { useTranslation } from 'react-i18next';
import { TextField, Button } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add';

import useStyles from './form.styles';
import useModals from '../../hooks/useModals';
import Nui from '../../../../os/nui-events/utils/Nui';

const NewMessageGroupForm = () => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { setShowNewMessageGroup } = useModals();
  const [ participants, setParticipants ] = useState('');

  const handleSubmit = () => {
    // handles phone numbers in a csv format and strips all spaces and
    // external characters out of them:
    // 123-4567, 987-6543, 333-4444
    const parts = participants.split(',').map(part => part.replace(/[^0-9]/g, ''));
    Nui.send('phone:createMessageGroup', { phoneNumbers: parts });
    setParticipants('');
    setShowNewMessageGroup(false); // close modal after submission
  }

  return (
    <div className={classes.formTop}>
      <TextField 
        value={participants}
        onChange={e => setParticipants(e.target.value)}
        placeholder={t("APPS_MESSAGES_NEW_MESSAGE_GROUP")}
        className={classes.input}
        inputProps={{
          className: classes.messagesInput
        }}
      />
      <Button className={classes.sendButton} onClick={handleSubmit} >
        <AddIcon fontSize="large" />
      </Button>
    </div>
  )
}

export default NewMessageGroupForm;
