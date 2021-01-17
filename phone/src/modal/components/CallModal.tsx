import React, { useState } from 'react';
import { Button, Fab } from '@material-ui/core';
import { AppWrapper } from '../../ui/components/AppWrapper';
import { AppTitle } from '../../ui/components/AppTitle';
import { AppContent } from '../../ui/components/AppContent';
import { useCall } from '../hooks/useCall';
import CallIcon from '@material-ui/icons/Call';
import PhoneDisabledIcon from '@material-ui/icons/PhoneDisabled';
import CallEndIcon from '@material-ui/icons/CallEnd';
import useStyles from './modal.styles';
import { useModal } from '../hooks/useModal';

export const CallModal = () => {
  const { call, setCall } = useCall();
  const { setModal }  = useModal()
  const [accepted, setAccepted] = useState(false)

  const classes = useStyles()

  const handleAcceptCall = () => {
    setAccepted(true)
  }

  const handleRejectCall = () => {
    setModal(false)
    setCall(null)
  }

  const handleEndCall = () => {
    setModal(false)
    setCall(null)
  }

  return (
    <AppWrapper>
      <AppContent>
        <h1 style={{ textAlign: 'center' }}>{call.target}</h1>

        <div className={classes.actions}>
          {!accepted ? (
            <>
              <Fab 
                onClick={handleRejectCall} 
                style={{ backgroundColor: '#e74c3c', color: '#fff' }} 
                className={classes.actionButton}>
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
