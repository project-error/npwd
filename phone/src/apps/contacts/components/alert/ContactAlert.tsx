import { Snackbar } from '@material-ui/core';
import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert } from '../../../../ui/components/Alert';
import { useContactAlert } from '../../hooks/useAlert';
import { AlertCategory } from '../../../../common/typings/contact';

// Used as a prefix for referencing the locales
// Needed to make code cleaner
const LOCALE_PREFIX = 'APPS_';

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

  const setMessageAlert = useCallback((type: AlertCategory, severity: 'success' | 'error') => {
    setMessage(t(LOCALE_PREFIX + type));
    setSeverity(severity);
    setOpen(true);
  }, [t]);

  useEffect(() => {
    switch (alert) {
      case 'CONTACT_ADD_FAILED':
        setMessageAlert(alert, 'error');
        break;
      case 'CONTACT_ADD_SUCCESS':
        setMessageAlert(alert, 'success');
        break;
      case 'CONTACT_DELETE_FAILED':
        setMessageAlert(alert, 'error');
        break;
      case 'CONTACT_DELETE_SUCCESS':
        setMessageAlert(alert, 'success');
        break;
      case 'CONTACT_UPDATE_FAILED':
        setMessageAlert(alert, 'error');
        break;
      case 'CONTACT_UPDATE_SUCCESS':
        setMessageAlert(alert, 'success');
        break;
    }
  }, [alert, setMessageAlert]);

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
