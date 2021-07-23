import React, { useEffect, useState } from 'react';
import { Avatar as MuiAvatar, Box, Button, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import { useContactActions } from '../../hooks/useContactActions';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import LogDebugEvent from '../../../../os/debug/LogDebugEvents';
import { useQueryParams } from '../../../../common/hooks/useQueryParams';
import { Contact, ContactEvents, ContactsDatabaseLimits } from '../../../../../../typings/contact';
import { TextField } from '../../../../ui/components/Input';
import { fetchNui } from '../../../../utils/fetchNui';
import { ServerPromiseResp } from '../../../../../../typings/common';
import { useSnackbar } from '../../../../ui/hooks/useSnackbar';

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
  const classes = useStyles();
  const history = useHistory();

  const { getContact, addContact, updateContact, deleteContact } = useContactActions();

  const { addAlert } = useSnackbar();

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

  const handleNumberChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const inputVal = e.target.value;
    if (inputVal.length === ContactsDatabaseLimits.number) return;
    setNumber(e.target.value);
  };

  const handleDisplayChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const inputVal = e.target.value;
    if (inputVal.length === ContactsDatabaseLimits.display) return;
    setName(e.target.value);
  };

  const handleAvatarChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const inputVal = e.target.value;
    if (inputVal.length === ContactsDatabaseLimits.avatar) return;
    setAvatar(e.target.value);
  };

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
    fetchNui<ServerPromiseResp<Contact>>(ContactEvents.ADD_CONTACT, {
      display: name,
      number,
      avatar,
    }).then((serverResp) => {
      if (serverResp.status !== 'ok') {
        return addAlert({
          message: t('APPS_CONTACT_ADD_FAILED'),
          type: 'error',
        });
      }

      // Sanity checks maybe?

      addContact(serverResp.data);
      addAlert({
        message: t('APPS_CONTACT_ADD_SUCCESS'),
        type: 'success',
      });
      history.replace(referal);
    });
  };

  const handleContactSave = () => {
    LogDebugEvent({
      action: 'Handling Contact Update',
      data: contact,
      level: 2,
    });
    fetchNui<ServerPromiseResp>(ContactEvents.UPDATE_CONTACT, {
      id: contact.id,
      display: name,
      number,
      avatar,
    }).then((resp) => {
      if (resp.status !== 'ok') {
        return addAlert({
          message: t('APPS_CONTACT_UPDATE_FAILED'),
          type: 'error',
        });
      }

      updateContact({
        id: contact.id,
        display: name,
        number,
        avatar,
      });

      addAlert({
        message: t('APPS_CONTACT_UPDATE_SUCCESS'),
        type: 'success',
      });

      history.goBack();
    });
  };

  const handleContactDelete = () => {
    LogDebugEvent({
      action: 'Handling Contact Delete',
      data: contact,
      level: 2,
    });
    fetchNui<ServerPromiseResp>(ContactEvents.DELETE_CONTACT, { id: contact.id }).then((resp) => {
      if (resp.status !== 'ok') {
        return addAlert({
          message: t('APPS_CONTACT_DELETE_FAILED'),
          type: 'error',
        });
      }
      history.goBack();
      deleteContact(contact.id);
      addAlert({
        message: t('APPS_CONTACT_DELETE_SUCCESS'),
        type: 'error',
      });
    });
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
          error={name.length === ContactsDatabaseLimits.display}
          className={classes.input}
          value={name}
          onChange={handleDisplayChange}
          label={t('APPS_CONTACT_FORM_NAME')}
          fullWidth
          inputProps={{
            className: classes.inputProps,
          }}
        />
        <TextField
          className={classes.input}
          value={number.length === ContactsDatabaseLimits.number}
          onChange={handleNumberChange}
          label={t('APPS_CONTACT_FORM_NUMBER')}
          fullWidth
          inputProps={{
            className: classes.inputProps,
          }}
        />
        <TextField
          error={avatar.length === ContactsDatabaseLimits.avatar}
          className={classes.input}
          label={t('APPS_CONTACT_FORM_AVATAR')}
          fullWidth
          value={avatar}
          onChange={handleAvatarChange}
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
