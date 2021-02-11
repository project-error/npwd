import React, { createContext, useState, useEffect, useMemo, useCallback } from 'react';
import Alert from './Alert';
import { makeStyles } from '@material-ui/core/styles';
import { Snackbar } from '@material-ui/core';
import { ISnackbar } from '../interface/InterfaceUI';

const useStyles = makeStyles(() => ({
  alert: {
    position: 'absolute', 
    bottom: '15%', 
    right: '25%', 
    margin: '0 auto', 
    textAlign: 'center'
  }
}))


export const SnackbarContext = createContext(null);
const AUTO_HIDE = 1500;

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
            <Alert auto key={alert} severity="success" variant={alert.type}>
              {alert.message}
            </Alert>
          </div>
        ))}
      </>
    </SnackbarContext.Provider>
  )
}

export default SnackbarProvider;