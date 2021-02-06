import React, { FormEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TextField, Button } from '@material-ui/core';

import useStyles from './form.styles';
import Nui from '../../../../os/nui-events/utils/Nui';
import { useHistory } from 'react-router-dom';

const NewMessageGroupForm = () => {
  const classes = useStyles();
  const history = useHistory();
  const { t } = useTranslation();
  const [participants, setParticipants] = useState('');
  const [label, setLabel] = useState('');

  // handles phone numbers in a csv format and strips all spaces and
  // external characters out of them:
  // 123-4567, 987-6543, 333-4444
  const parts = participants
    .split(',')
    .map((part) => part.replace(/[^0-9]/g, ''));
  const isGroupChat = parts.length > 1;

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (parts.length > 0) {
      const labelValue = label.trim();

      Nui.send('phone:createMessageGroup', {
        phoneNumbers: parts,
        label: isGroupChat && labelValue ? labelValue : null,
      });
      setParticipants('');
      history.push('/messages');
    }
  };

  return (
    <form className={classes.newGroupForm} onSubmit={handleSubmit}>
      <TextField
        value={participants}
        onChange={(e) => setParticipants(e.target.value)}
        placeholder={t('APPS_MESSAGES_NEW_MESSAGE_GROUP')}
        className={classes.newGroupinput}
        autoFocus
        inputProps={{
          className: classes.messagesInput,
        }}
        multiline
      />
      {isGroupChat && (
        <TextField
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder={t('APPS_MESSAGES_GROUP_CHAT_LABEL')}
          className={classes.newGroupinput}
          inputProps={{
            className: classes.messagesInput,
          }}
        />
      )}
      <Button
        variant='contained'
        className={classes.newGroupSubmitButton}
        color='primary'
        type='submit'
      >
        {t('APPS_MESSAGES_NEW_MESSAGE_GROUP_SUBMIT')}
      </Button>
    </form>
  );
};

export default NewMessageGroupForm;
