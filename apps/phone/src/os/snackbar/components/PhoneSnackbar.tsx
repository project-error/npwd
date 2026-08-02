import React from 'react';

import { ToastBanner, ToastStack } from '@npwd/keyos';
import { useSnackbar } from '../hooks/useSnackbar';

export const PhoneSnackbar: React.FC = () => {
  const { alert, isOpen, handleClose } = useSnackbar();

  if (!isOpen || !alert) return null;

  return (
    <ToastStack position="bottom">
      <ToastBanner
        onClose={handleClose}
        title={alert.message}
        variant={alert.type === 'error' ? 'danger' : alert.type === 'success' ? 'success' : 'default'}
      />
    </ToastStack>
  );
};
