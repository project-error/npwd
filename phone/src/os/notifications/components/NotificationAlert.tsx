import React from 'react';
import { makeStyles } from '@material-ui/core';
import { useNotifications } from '../hooks/useNotifications';
import { Alert, AlertTitle } from '@material-ui/lab';

const useStyles = makeStyles((theme) => ({
  snackbar: {
    marginTop: '-710px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alert: {
    cursor: 'pointer',
    width: '370px',
    height: '120px',
    zIndex: 10000,
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    '& .MuiAlert-icon': {
      color: theme.palette.text.primary,
    },
  },
}));

export const NotificationAlert = () => {
  const classes = useStyles();
  const { currentAlert } = useNotifications();

  return (
    <div className={classes.snackbar}>
      {currentAlert ? (
        <Alert
          onClick={() => currentAlert.onClick?.(currentAlert)}
          icon={currentAlert.icon || false}
          className={classes.alert}
          elevation={6}
        >
          <AlertTitle>{currentAlert.title}</AlertTitle>
          {currentAlert.content}
        </Alert>
      ) : null}
    </div>
  );
};
