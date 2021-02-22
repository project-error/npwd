import React from 'react';
import { makeStyles } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from '../hooks/useSnackbar';
import Alert from './Alert';

const useStyles = makeStyles({
  root: {
    marginTop: '-100px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export const Snackbar = () => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { alert } = useSnackbar();

  return (
    <div className={classes.root}>
      {alert ? (
        <Alert severity={alert.type}>
          {t('APPS_' + alert.message)}
        </Alert>
      ) : null}
    </div>
  );
};
