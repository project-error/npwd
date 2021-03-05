import React, { useState } from 'react';
import { Snackbar, Typography } from '@material-ui/core';
import { useNuiEvent } from '../../os/nui-events/hooks/useNuiEvent';
import { Alert } from './Alert';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  root: {
    position: 'absolute',
    width: 'auto',
    bottom: 20,
  },
});
// NOTE: Will make this more generic at some point for error handling as well
const WindowSnackbar = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [severity, setSeverity] = useState<'info' | 'error' | 'success'>('info');

  const classes = useStyles();

  useNuiEvent('PHONE', 'startRestart', () => {
    setMessage('Starting UI restart...');
    setOpen(true);
    setSeverity('info');
    setTimeout(() => window.location.reload(), 6000);
  });

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Snackbar open={open} autoHideDuration={4000} onClose={handleClose} className={classes.root}>
      <Alert severity={severity}>
        <Typography variant="body1">Phone - {message}</Typography>
      </Alert>
    </Snackbar>
  );
};

export default WindowSnackbar;
