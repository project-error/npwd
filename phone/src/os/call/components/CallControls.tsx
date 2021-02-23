import React from 'react';
import CallIcon from '@material-ui/icons/Call';
import CallEndIcon from '@material-ui/icons/CallEnd';
import { Fab } from '@material-ui/core';
import { useCall } from '../hooks/useCall';
import useStyles from './modal.styles';
import { useModal } from '../hooks/useModal';

export const CallControls = ({
  size,
}: {
  size?: 'small' | 'medium' | 'large';
}) => {
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
      <Fab
        size={size}
        onClick={handleEndCall}
        style={{ backgroundColor: '#e74c3c', color: '#fff' }}
        className={classes.actionButton}
      >
        <CallEndIcon />
      </Fab>
    );
  }
  return (
    <>
      <Fab
        size={size}
        onClick={handleRejectCall}
        style={{ backgroundColor: '#e74c3c', color: '#fff' }}
        className={classes.actionButton}
      >
        <CallEndIcon />
      </Fab>
      <Fab
        size={size}
        onClick={acceptCall}
        style={{ backgroundColor: '#27ae60', color: '#fff' }}
        className={classes.actionButton}
      >
        <CallIcon />
      </Fab>
    </>
  );
};
