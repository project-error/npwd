import { useContext } from 'react';
import { SnackbarContext } from '../providers/SnackbarProvider';

export interface IAlert {
  message: string;
  type: AlertType;
  duration?: number;
}

export type AlertType = 'success' | 'error' | 'info' | 'warning';

export interface ISnackBar {
  isOpen: boolean;
  alert?: IAlert;
  handleClose: () => void;
  addAlert: (alert: IAlert) => void;
}

export const useSnackbar = () => useContext(SnackbarContext);
