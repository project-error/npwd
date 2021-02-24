import React from 'react';
import CallIcon from '@material-ui/icons/Call';
import CallEndIcon from '@material-ui/icons/CallEnd';
import { useCall } from '../hooks/useCall';
import { useModal } from '../hooks/useModal';
import { StatusIconButton } from '../../../ui/components/StatusIconButton';
import { Box, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  icon: {
    color: theme.palette.secondary.contrastText,
  },
}));

const SIZES_SPACING = {
  small: 1,
  medium: 3,
};

export const CallControls = ({ size }: { size?: 'small' | 'medium' }) => {
  const classes = useStyles();
  const { setModal } = useModal();
  const { call, endCall, acceptCall, rejectCall } = useCall();

  if (!call) {
    return null;
  }

  const handleRejectCall = () => {
    setModal(false);
    rejectCall();
  };

  const handleEndCall = () => {
    setModal(false);
    endCall();
  };

  const { accepted, isTransmitter } = call;

  if (accepted || isTransmitter) {
    return (
      <StatusIconButton color='error' size={size} onClick={handleEndCall}>
        <CallEndIcon />
      </StatusIconButton>
    );
  }
  return (
    <>
      <Box ml={SIZES_SPACING[size] || 1} display='inline'>
        <StatusIconButton color='error' size={size} onClick={handleRejectCall}>
          <CallEndIcon className={classes.icon} />
        </StatusIconButton>
      </Box>
      <Box ml={SIZES_SPACING[size] || 1} display='inline'>
        <StatusIconButton color='success' size={size} onClick={acceptCall}>
          <CallIcon className={classes.icon} />
        </StatusIconButton>
      </Box>
    </>
  );
};
