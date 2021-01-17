import React, { useState } from 'react';
import { Button, Fab } from '@material-ui/core';
import { AppWrapper } from '../../ui/components/AppWrapper';
import { AppTitle } from '../../ui/components/AppTitle';
import { AppContent } from '../../ui/components/AppContent';
import { useCall } from '../hooks/useCall';
import CallIcon from '@material-ui/icons/Call';
<<<<<<< HEAD
import CallEndIcon from '@material-ui/icons/CallEnd';
import useStyles from './modal.styles';
import { useModal } from '../hooks/useModal';
import Nui from '../../os/nui-events/utils/Nui';

export const CallModal = () => {
  const { call } = useCall();
  const { setModal }  = useModal()
=======
import PhoneDisabledIcon from '@material-ui/icons/PhoneDisabled';
import CallEndIcon from '@material-ui/icons/CallEnd';
import useStyles from './modal.styles';
import { useModal } from '../hooks/useModal';

export const CallModal = () => {
  const { call, setCall } = useCall();
  const { setModal }  = useModal()
  const [accepted, setAccepted] = useState(false)
>>>>>>> 28774d24d89468bd6804b82c6beb0e40a3cd4abf

  const classes = useStyles()

  const handleAcceptCall = () => {
<<<<<<< HEAD
    Nui.send('phone:acceptCall', {
      phoneNumber: call.phone_number
    })
=======
    setAccepted(true)
>>>>>>> 28774d24d89468bd6804b82c6beb0e40a3cd4abf
  }

  const handleRejectCall = () => {
    setModal(false)
<<<<<<< HEAD
=======
    setCall(null)
>>>>>>> 28774d24d89468bd6804b82c6beb0e40a3cd4abf
  }

  const handleEndCall = () => {
    setModal(false)
<<<<<<< HEAD
=======
    setCall(null)
>>>>>>> 28774d24d89468bd6804b82c6beb0e40a3cd4abf
  }

  return (
    <AppWrapper>
      <AppContent>
<<<<<<< HEAD
        <h1 style={{ textAlign: 'center' }}>{call.transmitter ? call.target : call.caller}</h1>

        <div className={classes.actions}>
          {!call.accepted ? (
=======
        <h1 style={{ textAlign: 'center' }}>{call.target}</h1>

        <div className={classes.actions}>
          {!accepted ? (
>>>>>>> 28774d24d89468bd6804b82c6beb0e40a3cd4abf
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
