import React, { useState } from 'react';
import { Box, IconButton } from '@mui/material';

import { TextField } from '@ui/components/Input';
import fetchNui from '@utils/fetchNui';
import { ServerPromiseResp } from '@typings/common';
import { DispatchModel, EmergencyEvents, EmergencyServices } from '@typings/emergency';

import { DispatchAmbulance, DispatchPolice } from '@os/emergency/config';
import { hangup } from '@os/emergency/utils';
import { useHistory } from 'react-router';
import { Send } from '@mui/icons-material';
import { EmergencyChoice } from '@os/emergency/components/EmergencyChoice';

export const EmergencyDetails = React.forwardRef((props: any, ref) => {
  const history = useHistory();
  const [helper, setHelper] = useState(null);

  const dispatchServices = (message) => {
    fetchNui<ServerPromiseResp<DispatchModel>>(EmergencyEvents.DISPATCH, {
      job: props.service,
      message: message,
    }).then((data) => {
      console.log('dispatched nui', data);
    });
  };
  const handleSendDescription = () => {
    const el: HTMLInputElement = document.getElementById(
      'emergency-description',
    ) as HTMLInputElement;
    const value = el.value;
    if (value.length < 10) {
      setHelper('Please use a minimum of 15 characters');
      setTimeout(() => {
        setHelper(null);
      }, 2000);
      return;
    }
    let dispatchSound;
    switch (props.service) {
      case EmergencyServices.POLICE:
        dispatchSound = DispatchPolice;
        break;
      case EmergencyServices.AMBULANCE:
        dispatchSound = DispatchAmbulance;
        break;
      default:
        break;
    }

    dispatchSound.play().then((playback) => {
      props.setContext(<></>);
      setTimeout(() => {
        dispatchServices(value);
        hangup(history);
      }, dispatchSound.duration * 1000);
      props.setContext(<></>);
    });
  };

  return (
    <Box ref={ref}>
      <TextField
        error={helper !== null}
        helperText={helper}
        id="emergency-description"
        label="Emergency description"
        multiline
        sx={{ width: '100%' }}
        rows={4}
        defaultValue=""
        variant="filled"
        InputProps={{
          endAdornment: (
            <IconButton onClick={handleSendDescription}>
              <Send style={{ bottom: '0px' }} />{' '}
            </IconButton>
          ),
        }}
      />
    </Box>
  );
});
