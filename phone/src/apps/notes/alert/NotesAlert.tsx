import React, { useState, useEffect, useCallback } from 'react'
import { Snackbar } from '@material-ui/core';
import { Alert } from '../../../ui/components/Alert';
import { AlertCategory } from '../../../common/typings/notes';
import { useTranslation } from 'react-i18next';
import { useNotesAlert } from '../hooks/useNoteAlert';

const LOCALE_PREFIX = 'APPS_';

export const NotesAlert = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const { alert, setAlert } = useNotesAlert();
  const [message, setMessage] = useState(null);
  const [severity, setSeverity] = useState(''); 

  const _handleClose = () => {
    setOpen(false)
    setAlert(null)
  }

  const setMessageAlert = useCallback((type: AlertCategory, severity: 'success' | 'error') => {
    setMessage(t(LOCALE_PREFIX + type));
    setSeverity(severity)
    setOpen(true)
  }, [t])

  useEffect(() => {
    switch (alert) {
      case 'NOTES_ADD_SUCCESS':
        setMessageAlert(alert, 'success');
        break;
      case 'NOTES_ADD_FAILED':
        setMessageAlert(alert, 'error');
        break;
      case 'NOTES_UPDATE_SUCCESS':
        setMessageAlert(alert, 'success');
        break;
      case 'NOTES_UPDATE_FAILED':
        setMessageAlert(alert, 'error');
        break;
      case 'NOTES_DELETE_SUCCESS':
        setMessageAlert(alert, 'success');
        break;
      case 'NOTES_DELETE_FAILED': 
        setMessageAlert(alert, 'error')
    }
  }, [alert, setMessageAlert])

  return (
    <Snackbar
      style={{ width: '80%', position: 'absolute', bottom: '10%' }}
      autoHideDuration={1500}
      open={open}
      onClose={_handleClose}
    >
      <Alert severity={severity} variant='filled'>
        {message}
      </Alert>
  </Snackbar>
  )
}
