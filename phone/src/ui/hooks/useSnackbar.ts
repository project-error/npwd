import { useContext } from 'react';
import { SnackbarContext } from '../providers/SnackbarProvider';


export interface IAlert {
  message: string;
  type: 'success' | 'error'
}

interface ISnackBar {
  addAlert: ({ message, type}: IAlert) => void;
  alert: IAlert | null;
}

export const useSnackbar = (): ISnackBar => useContext(SnackbarContext);