import React, { createContext, useState } from 'react';
import { IAlert } from '../hooks/useSnackbar';

export const SnackbarContext = createContext(null);

interface SnackbarProviderProps {
    children: React.ReactNode;
}
const SnackbarProvider: React.FC<SnackbarProviderProps> = ({ children }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [alert, setAlert] = useState<IAlert>(null);

  const setNewAlert = (alert: IAlert) => {
    setAlert(alert);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <SnackbarContext.Provider value={{ alert, addAlert: setNewAlert, handleClose, isOpen: open }}>
      {children}
    </SnackbarContext.Provider>
  );
};

export default SnackbarProvider;
