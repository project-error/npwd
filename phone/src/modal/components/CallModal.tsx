import React, { useState } from 'react';
import { Button, Fab } from '@material-ui/core';
import { AppWrapper } from '../../ui/components/AppWrapper';
import { AppTitle } from '../../ui/components/AppTitle';
import { AppContent } from '../../ui/components/AppContent';
import { useCall } from '../hooks/useCall';
import CallIcon from '@material-ui/icons/Call';
import CallEndIcon from '@material-ui/icons/CallEnd';
import useStyles from './modal.styles';
import { useModal } from '../hooks/useModal';
import Nui from '../../os/nui-events/utils/Nui';

export const CallModal = () => {
  const { call } = useCall();
  const { setModal } = useModal();

  const classes = useStyles();

  const handleAcceptCall = () => {
    Nui.send('phone:acceptCall', {
      phoneNumber: call.phone_number
    });
  };

  const handleRejectCall = () => {
    setModal(false);
  };

  const handleEndCall = () => {
    setModal(false);
  };

  return (
    <AppWrapper>
      <AppContent>
        <h1 style={{ textAlign: 'center' }}>
          {call.transmitter ? call.target : call.caller}
        </h1>

        <div className={classes.actions}>
          {!call.accepted ? (
            <>
              <Fab
                onClick={handleRejectCall}
                style={{ backgroundColor: '#e74c3c', color: '#fff' }}
                className={classes.actionButton}
              >
                <CallEndIcon />
              </Fab>
              <Fab
                onClick={handleAcceptCall}
                style={{ backgroundColor: '#27ae60', color: '#fff' }}
                className={classes.actionButton}
              >
                <CallIcon />
              </Fab>
            </>
          ) : (
            <Fab
              onClick={handleEndCall}
              style={{ backgroundColor: '#e74c3c', color: '#fff' }}
              className={classes.actionButton}
            >
              <CallEndIcon />
            </Fab>
          )}
        </div>
      </AppContent>
    </AppWrapper>
  );
};
