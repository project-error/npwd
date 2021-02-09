import React, { useState } from 'react';
import {
  Avatar as MuiAvatar,
  Button,
  Paper,
  TextField,
} from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import { useContacts } from '../../hooks/useContacts';
import Nui from '../../../../os/nui-events/utils/Nui';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import LogDebugEvent from '../../../../os/debug/LogDebugEvents';

interface ContactInfoRouteParams {
  mode: string;
  id: string;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    height: '100%',
    width: '100%',
  },
  listContainer: {
    marginTop: 30,
    width: '75%',
    margin: '0 auto',
    textAlign: 'center',
  },
  avatar: {
    margin: 'auto',
    height: '125px',
    width: '124px',
    marginBottom: 29,
  },
  input: {
    marginBottom: 20,
    margin: 'auto',
    textAlign: 'center',
  },
  inputProps: {
    fontSize: 22,
  },
  updateButton: {
    background: '#2196f3',
    width: 150,
    height: 45,
    fontSize: 16,
    marginTop: 29,
    marginBottom: 29,
  },
  deleteButton: {
    background: '#d32f2f',
    width: 150,
    height: 40,
    fontSize: 16,
  },
  saveButton: {
    background: theme.palette.success.dark,
    color: '#fff',
    width: 150,
    height: 45,
    fontsize: 22,
    marginTop: theme.spacing(2),
  },
}));

const ContactsInfoPage = () => {
  const classes = useStyles();

  const history = useHistory();

  const { getContact } = useContacts();

  const { id } = useParams<ContactInfoRouteParams>();

  const contact = getContact(parseInt(id));

  // Set state after checking if null
  const [name, setName] = useState(contact ? contact.display : contact);
  const [number, setNumber] = useState(contact ? contact.number : contact);
  const [avatar, setAvatar] = useState(contact ? contact.avatar : contact);

  const { t } = useTranslation();

  const handleContactAdd = () => {
    LogDebugEvent({
      action: 'Handling Contact Add',
      data: contact,
      level: 2,
    });
    Nui.send('phone:addContact', {
      name,
      number,
      avatar,
    });
  };

  const handleContactSave = () => {
    LogDebugEvent({
      action: 'Handling Contact Update',
      data: contact,
      level: 2,
    });
    Nui.send('phone:updateContact', {
      id: contact.id,
      display: name,
      number,
      avatar,
    });
  };

  const handleContactDelete = () => {
    LogDebugEvent({
      action: 'Handling Contact Delete',
      data: contact,
      level: 2,
    });
    Nui.send('phone:deleteContact', {
      id: contact.id,
    });
  };

  return (
    <Paper className={classes.root} square>
      <Button style={{ margin: 10 }} onClick={() => history.goBack()}>
        <ArrowBackIcon fontSize='large' />
      </Button>
      <div className={classes.listContainer}>
        {avatar ? (
          <MuiAvatar className={classes.avatar} src={contact.avatar} />
        ) : (
          <MuiAvatar className={classes.avatar} />
        )}
        <TextField
          className={classes.input}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t('APPS_CONTACT_FORM_NAME')}
          fullWidth
          inputProps={{
            className: classes.inputProps,
          }}
        />
        <TextField
          className={classes.input}
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          placeholder={t('APPS_CONTACT_FORM_NUMBER')}
          fullWidth
          inputProps={{
            className: classes.inputProps,
          }}
        />
        <TextField
          className={classes.input}
          placeholder={t('APPS_CONTACT_FORM_AVATAR')}
          fullWidth
          value={avatar}
          onChange={(e) => setAvatar(e.target.value)}
          inputProps={{
            className: classes.inputProps,
          }}
        />
        {/* Display if fetched contact */}
        {contact && (
          <div style={{ display: 'block' }}>
            <Button
              onClick={handleContactSave}
              className={classes.updateButton}
            >
              {t('GENERIC_UPDATE')}
            </Button>
            <Button
              onClick={handleContactDelete}
              className={classes.deleteButton}
            >
              {t('GENERIC_DELETE')}
            </Button>
          </div>
        )}
        {/* Display if no fetched contact */}
        {!contact && (
          <div style={{ display: 'block' }}>
            <Button onClick={handleContactAdd} className={classes.saveButton}>
              {t('APPS_CONTACT_MODAL_BUTTON_ADD')}
            </Button>
          </div>
        )}
      </div>
    </Paper>
  );
};

export default ContactsInfoPage;
