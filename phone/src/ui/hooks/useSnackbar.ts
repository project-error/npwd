import { useContext } from 'react';
import { SnackbarContext } from '../components/SnackbarProvider';

interface ISnackBar {
  addAlert: (message: string, severity: string) => void;
}

export const useSnackbar = (): ISnackBar => useContext(SnackbarContext);