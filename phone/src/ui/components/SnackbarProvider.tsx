import React, { createContext, useState, useEffect, useMemo, useCallback } from 'react';
import Alert from './Alert';
import { makeStyles } from '@material-ui/core/styles';
import { Snackbar } from '@material-ui/core';
import { ISnackbar } from '../interface/InterfaceUI';

const useStyles = makeStyles(() => ({
  alert: {
    marginTop: '-100px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
}))


export const SnackbarContext = createContext(null);
const AUTO_HIDE = 2000;

function SnackbarProvider({ children }) {
  const [alerts, setAlerts] = useState([]);
  const classes = useStyles();

  const alertIdx = alerts.join(',');

  useEffect(() => {
    const timer = setTimeout(() => setAlerts((alert) => alerts.slice(0, alerts.length - 1)), AUTO_HIDE);
    return () => clearTimeout(timer);
  }, [alertIdx])

  const addAlert = useCallback((message, type) => setAlerts((alerts) => [{message, type}, ...alerts]), []);

  const value = useMemo(() => ({ addAlert }), [addAlert]);

  return (
    <SnackbarContext.Provider value={value}>
      <>
        {children}
        {alerts.map((alert: ISnackbar) => (
          <div className={classes.alert}>
            <Alert key={alert} severity={alert.type} variant="filled">
              {alert.message}
            </Alert>
          </div>
        ))}
      </>
    </SnackbarContext.Provider>
  )
}

export default SnackbarProvider;