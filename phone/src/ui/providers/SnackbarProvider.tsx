import React, { createContext, useState, useEffect, useRef } from 'react';

export const SnackbarContext = createContext(null);

function SnackbarProvider({ children }) {
  const [alert, setAlert] = useState(null);
  const timer = useRef(null);

  useEffect(() => {
    if (alert) {
      clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        setAlert(null);
      }, 2000);
    }
    return () => clearTimeout(timer.current);
  }, [alert]);

  return <SnackbarContext.Provider value={{ alert, addAlert: setAlert }}>{children}</SnackbarContext.Provider>;
}

export default SnackbarProvider;
