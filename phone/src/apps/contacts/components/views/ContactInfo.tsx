import React, { useEffect, useState } from 'react';
import { Avatar as MuiAvatar, Box, Button, Paper, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import { useContacts } from '../../hooks/useContacts';
import { useNuiRequest } from 'fivem-nui-react-lib';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import LogDebugEvent from '../../../../os/debug/LogDebugEvents';
import { useQueryParams } from '../../../../common/hooks/useQueryParams';
import { ContactEvents } from '../../../../../../typings/contact';

interface ContactInfoRouteParams {
  mode: string;
  id: string;
}

interface ContactInfoRouteQuery {
  addNumber?: string;
  referal?: string;
}

const useStyles = makeStyles({
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
});

const ContactsInfoPage = () => {
  const Nui = useNuiRequest();
  const classes = useStyles();
  const history = useHistory();

  const { getContact } = useContacts();

  const { id } = useParams<ContactInfoRouteParams>();
  const { addNumber, referal } = useQueryParams<ContactInfoRouteQuery>({
    referal: '/contacts',
  });

  const contact = getContact(parseInt(id));

  // Set state after checking if null
  const [name, setName] = useState(contact ? contact.display : '');
  const [number, setNumber] = useState(contact ? contact.number : '');
  const [avatar, setAvatar] = useState(contact ? contact.avatar : '');

  const { t } = useTranslation();

  useEffect(() => {
    if (addNumber) {
      setNumber(addNumber);
    }
  }, [addNumber]);

  const handleContactAdd = () => {
    LogDebugEvent({
      action: 'Handling Contact Add',
      data: contact,
      level: 2,
    });
    Nui.send(ContactEvents.ADD_CONTACT, {
      display: name,
      number,
      avatar,
    });
    history.replace(referal);
  };

  const handleContactSave = () => {
    LogDebugEvent({
      action: 'Handling Contact Update',
      data: contact,
      level: 2,
    });
    Nui.send(ContactEvents.UPDATE_CONTACT, {
      id: contact.id,
      display: name,
      number,
      avatar,
    });
    history.goBack();
  };

  const handleContactDelete = () => {
    LogDebugEvent({
      action: 'Handling Contact Delete',
      data: contact,
      level: 2,
    });
    Nui.send(ContactEvents.DELETE_CONTACT, contact.id);
    history.goBack();
  };

  return (
    <Paper className={classes.root} square>
      <Button style={{ margin: 10 }} onClick={() => history.goBack()}>
        <ArrowBackIcon fontSize="large" />
      </Button>
      <div className={classes.listContainer}>
        <MuiAvatar className={classes.avatar} src={avatar} />
        <TextField
          autoFocus
          className={classes.input}
          value={name}
          onChange={(e) => setName(e.target.value)}
          label={t('APPS_CONTACT_FORM_NAME')}
          fullWidth
          inputProps={{
            className: classes.inputProps,
          }}
        />
        <TextField
          className={classes.input}
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          label={t('APPS_CONTACT_FORM_NUMBER')}
          fullWidth
          inputProps={{
            className: classes.inputProps,
          }}
        />
        <TextField
          className={classes.input}
          label={t('APPS_CONTACT_FORM_AVATAR')}
          fullWidth
          value={avatar}
          onChange={(e) => setAvatar(e.target.value)}
          inputProps={{
            className: classes.inputProps,
          }}
        />
        {/* Display if fetched contact */}
        {contact && (
          <>
            <Box py={1} display="block">
              <Button color="primary" variant="contained" onClick={handleContactSave}>
                {t('GENERIC_UPDATE')}
              </Button>
            </Box>
            <Box py={1} display="block">
              <Button variant="contained" color="secondary" onClick={handleContactDelete}>
                {t('GENERIC_DELETE')}
              </Button>
            </Box>
          </>
        )}
        {/* Display if no fetched contact */}
        {!contact && (
          <Box display="block">
            <Button color="primary" variant="contained" onClick={handleContactAdd}>
              {t('APPS_CONTACT_MODAL_BUTTON_ADD')}
            </Button>
          </Box>
        )}
      </div>
    </Paper>
  );
};

export default ContactsInfoPage;
