import React, { createContext, useState, useEffect, useRef, useMemo, useCallback } from 'react';
import Alert from './Alert';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { IAlert } from '../hooks/useSnackbar';

const useStyles = makeStyles(() => ({
  alert: {
    marginTop: '-100px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  hidden: {
    display: 'none'
  }
}))


export const SnackbarContext = createContext({ addAlert: (a: IAlert) => {} });

function SnackbarProvider({ children }) {
  const classes = useStyles();
  const { t } = useTranslation()
  const [alert, setAlert] = useState(null);
  const timer = useRef(null);

  useEffect(() => {
    if (alert) {
      clearTimeout(timer.current)
      timer.current = setTimeout(() => {
        setAlert(null)
      }, 2500);
    }
    return () => clearTimeout(timer.current)
  }, [alert]);


  const addAlert = (value) => setAlert(value);

  const value = { addAlert, alert }

  return (
    <SnackbarContext.Provider value={value}>
      <>
        {children}
      </>
    </SnackbarContext.Provider>
  )
}

export default SnackbarProvider;