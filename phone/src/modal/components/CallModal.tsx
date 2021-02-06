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
import CallTimer from './CallTimer';
import InjectDebugData from '../../os/debug/InjectDebugData';

InjectDebugData([
  {
    app: 'CALL',
    method: 'setCaller',
    data: {
      accepted: true,
      isTransmitter: true,
      transmitter: 'Chip',
      receiver: 'Taso',
      phone_number: '860-4504',
    },
  },
]);

export const CallModal = () => {
  const { call } = useCall();
  const { setModal } = useModal();

  const classes = useStyles();

  const handleAcceptCall = () => {
    Nui.send('phone:acceptCall', {
      transmitterNumber: call.transmitter,
    });
  };

  const handleRejectCall = () => {
    setModal(false);
    Nui.send('phone:rejectCall', {
      phoneNumber: call.transmitter,
    });
  };

  const handleEndCall = () => {
    setModal(false);
    Nui.send('phone:endCall', {
      transmitterNumber: call.transmitter,
    });
  };

  if (call.isTransmitter) {
    return (
      <AppWrapper>
        <AppContent>
          <h1 style={{ textAlign: 'center' }}>{call.receiver}</h1>
          <CallTimer isAccepted={call.accepted} />
          <div className={classes.actions}>
            <Fab
              onClick={handleEndCall}
              style={{ backgroundColor: '#e74c3c', color: '#fff' }}
              className={classes.actionButton}
            >
              <CallEndIcon />
            </Fab>
          </div>
        </AppContent>
      </AppWrapper>
    );
  }

  return (
    <AppWrapper>
      <AppContent>
        <h1 style={{ textAlign: 'center' }}>{call.transmitter}</h1>
        <CallTimer isAccepted={call.accepted} />
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
