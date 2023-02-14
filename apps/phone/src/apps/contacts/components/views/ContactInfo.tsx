import React, { useEffect, useState } from 'react';
import { Avatar as MuiAvatar, Box, Button, Paper } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import { useContactActions } from '../../hooks/useContactActions';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useQueryParams } from '@common/hooks/useQueryParams';
import { ContactsDatabaseLimits } from '@typings/contact';
import { TextField } from '@ui/components/Input';
import { useContactsAPI } from '../../hooks/useContactsAPI';

interface ContactInfoRouteParams {
  mode: string;
  id: string;
}

interface ContactInfoRouteQuery {
  addNumber?: string;
  referal?: string;
  name?: string;
  avatar?: string;
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

const ContactsInfoPage: React.FC = () => {
  const classes = useStyles();
  const history = useHistory();
  const { id } = useParams<ContactInfoRouteParams>();
  const {
    addNumber,
    // Because this is mispelled absolutely everywhere
    referal: referral,
    avatar: avatarParam,
    name: nameParam,
  } = useQueryParams<ContactInfoRouteQuery>({
    referal: '/contacts',
  });

  const { getContact } = useContactActions();
  const { updateContact, addNewContact, deleteContact } = useContactsAPI();

  const contact = getContact(parseInt(id));

  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [avatar, setAvatar] = useState('');
  // Set state after checking if null

  const [t] = useTranslation();

  const handleNumberChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const inputVal = e.currentTarget.value;
    if (inputVal.length === ContactsDatabaseLimits.number) return;
    setNumber(e.target.value);
  };

  const handleDisplayChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const inputVal = e.currentTarget.value;
    if (inputVal.length === ContactsDatabaseLimits.display) return;
    setName(e.target.value);
  };

  const handleAvatarChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const inputVal = e.currentTarget.value;
    if (inputVal.length === ContactsDatabaseLimits.avatar) return;
    setAvatar(e.target.value);
  };

  const handleContactAdd = () => {
    addNewContact({ display: name, number, avatar }, referral);
  };

  const handleContactDelete = () => {
    deleteContact({ id: contact.id });
  };

  const handleContactUpdate = () => {
    updateContact({ id: contact.id, number, avatar, display: name });
  };

  useEffect(() => {
    if (addNumber) setNumber(addNumber);
    if (avatarParam) setAvatar(avatarParam);
    if (nameParam) setName(nameParam);
  }, [addNumber, avatar, avatarParam, nameParam]);

  return (
    <Paper className={classes.root} square>
      <Button style={{ margin: 10 }} onClick={() => history.goBack()}>
        <ArrowBackIcon fontSize="large" />
      </Button>
      <div className={classes.listContainer}>
        <MuiAvatar className={classes.avatar} src={avatar} />
        <TextField
          autoFocus
          error={name.length >= ContactsDatabaseLimits.display}
          className={classes.input}
          value={name}
          onChange={handleDisplayChange}
          label={t('CONTACTS.FORM_NAME')}
          fullWidth
          inputProps={{
            className: classes.inputProps,
          }}
        />
        <TextField
          className={classes.input}
          error={number.length >= ContactsDatabaseLimits.number}
          value={number}
          onChange={handleNumberChange}
          label={t('CONTACTS.FORM_NUMBER')}
          fullWidth
          inputProps={{
            className: classes.inputProps,
          }}
        />
        <TextField
          error={avatar.length >= ContactsDatabaseLimits.avatar}
          className={classes.input}
          label={t('CONTACTS.FORM_AVATAR')}
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
              <Button color="primary" variant="contained" onClick={handleContactUpdate}>
                {t('GENERIC.UPDATE')}
              </Button>
            </Box>
            <Box py={1} display="block">
              <Button variant="contained" color="secondary" onClick={handleContactDelete}>
                {t('GENERIC.DELETE')}
              </Button>
            </Box>
          </>
        )}
        {/* Display if no fetched contact */}
        {!contact && (
          <Box display="block">
            <Button color="primary" variant="contained" onClick={handleContactAdd}>
              {t('CONTACTS.MODAL_BUTTON_ADD')}
            </Button>
          </Box>
        )}
      </div>
    </Paper>
  );
};

export default ContactsInfoPage;
