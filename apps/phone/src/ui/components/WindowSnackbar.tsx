import React, { useState } from 'react';
import { ToastStack } from '@npwd/keyos';
import { Alert } from './Alert';
import { useNuiEvent } from 'fivem-nui-react-lib';

const WindowSnackbar: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [severity, setSeverity] = useState<'info' | 'error' | 'success'>('info');

  useNuiEvent('PHONE', 'startRestart', () => {
    setMessage('Restarting UI');
    setOpen(true);
    setSeverity('error');
    setTimeout(() => window.location.reload(), 3000);
  });

  const handleClose = () => {
    setOpen(false);
  };

  if (!open) return null;

  return (
    <ToastStack className="pointer-events-auto bottom-5" position="bottom">
      <Alert onClose={handleClose} severity={severity}>
        Phone - {message}
      </Alert>
    </ToastStack>
  );
};

export default WindowSnackbar;
