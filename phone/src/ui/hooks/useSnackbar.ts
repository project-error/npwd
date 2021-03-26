import { useContext } from 'react';
import { SnackbarContext } from '../providers/SnackbarProvider';

export interface IAlert {
  message: string;
  type: AlertType;
}

export type AlertType = 'success' | 'error' | 'info' | 'warning';

interface ISnackBar {
  addAlert: ({ message, type }: IAlert) => void;
  alert: IAlert | null;
  isOpen: boolean;
  handleClose: () => void;
}

export const useSnackbar = (): ISnackBar => useContext(SnackbarContext);
