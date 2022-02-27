import React, { createContext, useState } from 'react';
import { IAlert, ISnackBar } from '../hooks/useSnackbar';

export const SnackbarContext = createContext<ISnackBar>({} as ISnackBar);

const SnackbarProvider: React.FC = ({ children }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [alert, setAlert] = useState<IAlert>();

  const setNewAlert = (alert: IAlert) => {
    setAlert(alert);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handler = { alert, addAlert: setNewAlert, handleClose, isOpen: open };

  return <SnackbarContext.Provider value={handler}>{children}</SnackbarContext.Provider>;
};

export default SnackbarProvider;
