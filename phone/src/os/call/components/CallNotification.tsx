import React from 'react';
import { Box, makeStyles } from '@material-ui/core';
import { CallControls } from './CallControls';

interface ICallNotificationProps {
  onAccept(): void;
  onReject(): void;
}

const useStyles = makeStyles((theme) => ({
  root: {
    paddingBottom: '48px',
  },
  controls: {
    position: 'absolute',
    bottom: theme.spacing(1),
    right: '4px',
  },
}));

export const CallNotification = ({ children }: { children: React.ReactNode }) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Box>{children}</Box>
      <Box className={classes.controls}>
        <CallControls isSmall />
      </Box>
    </div>
  );
};
