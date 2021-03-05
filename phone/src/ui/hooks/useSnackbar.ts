import { useContext } from 'react';
import { SnackbarContext } from '../providers/SnackbarProvider';

export interface IAlert {
  message: string;
  type: AlertType;
}

export type AlertType = 'success' | 'error' | 'info';

interface ISnackBar {
  addAlert: ({ message, type }: IAlert) => void;
  alert: IAlert | null;
}

export const useSnackbar = (): ISnackBar => useContext(SnackbarContext);
