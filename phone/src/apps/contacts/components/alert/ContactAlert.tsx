import { Snackbar } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert } from '../../../../ui/components/Alert';
import { useContactAlert } from '../../hooks/useAlert';

export const ContactAlert = () => {
  const { t } = useTranslation();
  const { alert, setAlert } = useContactAlert();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState(null);
  const [severity, setSeverity] = useState('');

  const _handleClose = () => {
    setOpen(false);
    setAlert(null);
  };

  useEffect(() => {
    if (alert === 'CONTACT_ADD_SUCCESS') {
      setMessage(t('APPS_CONTACTS_ADD_SUCCESS'));
      setSeverity('success');
      setOpen(true);
    } else if (alert === 'CONTACT_ADD_FAILED') {
      setMessage(t('APPS_CONTACTS_ADD_FAILED'));
      setSeverity('error');
      setOpen(true);
    } else if (alert === 'CONTACT_UPDATE_SUCCESS') {
      setMessage(t('APPS_CONTACTS_UPDATE_SUCCESS'));
      setSeverity('success');
      setOpen(true);
    } else if (alert === 'CONTACT_UPDATE_FAILED') {
      setMessage(t('APPS_CONTACTS_UPDATE_FAILED'));
      setSeverity('error');
      setOpen(true);
    } else if (alert === 'CONTACT_DELETE_SUCCESS') {
      setMessage(t('APPS_CONTACTS_DELETE_SUCCESS'));
      setSeverity('success');
      setOpen(true);
    } else if (alert === 'CONTACT_DELETE_FAILED') {
      setMessage(t('APPS_CONTACTS_DELETE_FAILED'));
      setSeverity('error');
      setOpen(true);
    }
  }, [alert]);

  return (
    <Snackbar
      style={{ width: '80%', position: 'absolute', bottom: '10%' }}
      autoHideDuration={6000}
      open={open}
      onClose={_handleClose}
    >
      <Alert severity={severity} variant='filled'>
        {message}
      </Alert>
    </Snackbar>
  );
};
