import { useContext } from 'react';
import { SnackbarContext } from '../components/SnackbarProvider';

interface ISnackBar {
  addAlert: (message: string, type: 'success' | 'error') => void;
}

export const useSnackbar = (): ISnackBar => useContext(SnackbarContext);