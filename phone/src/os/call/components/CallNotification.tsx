import React from 'react';
import { Box } from '@material-ui/core';
import { CallControls } from './CallControls';

interface ICallNotificationProps {
  onAccept(): void;
  onReject(): void;
}

export const CallNotification = () => {
  return (
    <Box textAlign="right">
      <CallControls size="small" />
    </Box>
  );
};
