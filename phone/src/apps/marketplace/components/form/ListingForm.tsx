import React, { useState } from 'react';
import { makeStyles, Button, TextField, Typography } from '@material-ui/core';
import Nui from '../../../../os/nui-events/utils/Nui';
import { MarketplaceEvents } from '../../../../../../typings/marketplace';
import { useSnackbar } from '../../../../ui/hooks/useSnackbar';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    margin: 'auto',
    textAlign: 'center',
  },
  input: {
    marginBottom: 25,
  },
  textFieldInput: {
    fontSize: 22,
  },
  multilineFieldInput: {
    fontSize: 20,
  },
  postButton: {
    display: 'block',
    margin: 'auto',
    background: theme.palette.primary.main,
    width: '80%',
    fontSize: 20,
  },
}));

export const ListingForm = () => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { addAlert } = useSnackbar();
  const history = useHistory();

  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');

  const addListing = () => {
    if (title !== '' && description !== '') {
      Nui.send(MarketplaceEvents.ADD_LISTING, {
        title,
        url,
        description,
      });
      history.push('/marketplace');
    } else {
      addAlert({
        message: t('APPS_MARKETPLACE_REQUIRED_FIELDS'),
        type: 'error',
      });
    }
  };

  return (
    <div className={classes.root}>
      <h1>New Listing</h1>
      <TextField
        className={classes.input}
        onChange={(e) => setTitle(e.target.value)}
        label={t('GENERIC_REQUIRED')}
        placeholder={t('APPS_MARKETPLACE_FORM_TITLE')}
        inputProps={{
          className: classes.textFieldInput,
          maxLength: 25,
        }}
        style={{ width: '80%' }}
        size="medium"
        InputLabelProps={{
          shrink: true,
        }}
      />

      <TextField
        className={classes.input}
        placeholder={t('APPS_MARKETPLACE_FORM_IMAGE')}
        onChange={(e) => setUrl(e.target.value)}
        inputProps={{ className: classes.textFieldInput }}
        style={{ width: '80%' }}
        size="medium"
        variant="outlined"
      />

      <TextField
        className={classes.input}
        onChange={(e) => setDescription(e.target.value)}
        label={t('GENERIC_REQUIRED')}
        placeholder={t('APPS_MARKETPLACE_FORM_DESCRIPTION')}
        inputProps={{
          className: classes.multilineFieldInput,
          maxLength: 130,
        }}
        style={{ width: '80%' }}
        size="medium"
        InputLabelProps={{
          shrink: true,
        }}
        multiline
        rows={4}
        variant="outlined"
      />
      <Button onClick={addListing} className={classes.postButton}>
        Post
      </Button>
    </div>
  );
};
