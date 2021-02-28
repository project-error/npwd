import React from 'react';
import CallIcon from '@material-ui/icons/Call';
import CallEndIcon from '@material-ui/icons/CallEnd';
import { useCall } from '../hooks/useCall';
import { useCallModal } from '../hooks/useCallModal';
import { StatusIconButton } from '../../../ui/components/StatusIconButton';
import { Box, makeStyles } from '@material-ui/core';
import { useHistory } from 'react-router-dom';

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
  const history = useHistory();
  const { setModal } = useCallModal();
  const { call, endCall, acceptCall, rejectCall } = useCall();

  if (!call) {
    return null;
  }

  const handleAcceptCall = (e) => {
    e.stopPropagation();
    history.push('/call');
    acceptCall();
  };

  const handleRejectCall = (e) => {
    e.stopPropagation();
    setModal(false);
    rejectCall();
  };

  const handleEndCall = (e) => {
    e.stopPropagation();
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
      <Box m={SIZES_SPACING[size] || 1} display='inline'>
        <StatusIconButton color='error' size={size} onClick={handleRejectCall}>
          <CallEndIcon className={classes.icon} />
        </StatusIconButton>
      </Box>
      <Box m={SIZES_SPACING[size] || 1} display='inline'>
        <StatusIconButton
          color='success'
          size={size}
          onClick={handleAcceptCall}
        >
          <CallIcon className={classes.icon} />
        </StatusIconButton>
      </Box>
    </>
  );
};
