import React, { createContext, useState, useEffect, useMemo, useCallback } from 'react';
import { SnackBar } from './SnackBar';


export const SnackbarContext = createContext(null);
const AUTO_HIDE = 2000;

function SnackbarProvider({ children }) {
  const [alerts, setAlerts] = useState([]);

  const alertIdx = alerts.join(',');

  useEffect(() => {
    const timer = setTimeout(() => setAlerts((alert) => alerts.slice(0, alerts.length - 1)), AUTO_HIDE);
    return () => clearTimeout(timer);
  }, [alertIdx])

  const addAlert = useCallback((content) => setAlerts((alerts) => [content, ...alerts]), []);

  const value = useMemo(() => ({ addAlert }), [addAlert]);

  return (
    <SnackbarContext.Provider value={value}>
      {children}
      {alerts.map((alert) => <SnackBar key={alert}>{alert}</SnackBar>)}
    </SnackbarContext.Provider>
  )
}

export default SnackbarProvider;