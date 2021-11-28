import React from 'react';
import { Snackbar } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { useSnackbar } from '../hooks/useSnackbar';
import Alert from '../../../ui/components/Alert';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 'auto',
    width: 'auto',
    overflow: 'auto',
    margin: '0 auto',
    position: 'absolute',
    left: 0,
    bottom: 75,
    right: 0,
    transform: 'none',
  },
});

export const PhoneSnackbar: React.FC = () => {
  const classes = useStyles();
  const { alert, isOpen, handleClose } = useSnackbar();

  return (
    <Snackbar autoHideDuration={2000} open={isOpen} className={classes.root} onClose={handleClose}>
      <Alert severity={alert?.type || 'info'} onClose={handleClose}>
        {alert?.message || ''}
      </Alert>
    </Snackbar>
  );
};
