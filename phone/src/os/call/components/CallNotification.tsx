import React from 'react';
import { Box } from '@material-ui/core';
import { CallControls } from './CallControls';

interface ICallNotificationProps {
  onAccept(): void;
  onReject(): void;
}

export const CallNotification = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div style={{ paddingBottom: '48px' }}>
      <Box>{children}</Box>
      <Box style={{ position: 'absolute', bottom: 0, right: 0 }}>
        <CallControls size='small' />
      </Box>
    </div>
  );
};
