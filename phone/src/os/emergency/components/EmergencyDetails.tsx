import React, { useState } from 'react';
import {
  Box,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  TextField,
  Typography,
} from '@mui/material';
import LocalPoliceIcon from '@mui/icons-material/LocalPolice';
import HealingIcon from '@mui/icons-material/Healing';
import fetchNui from '@utils/fetchNui';
import { ServerPromiseResp } from '@typings/common';
import {
  AudioEventArguments,
  AudioTypes,
  EmergencyEvents,
  EmergencyServices,
} from '@typings/emergency';
import { setContext } from '@sentry/react';
import {
  AskDescription,
  DispatchAmbulance,
  DispatchIntro,
  DispatchPolice,
} from '@os/emergency/config';
import { hangup } from '@os/emergency/utils';
import { useHistory } from 'react-router';
import { Send } from '@mui/icons-material';
import { EmergencyChoice } from '@os/emergency/components/EmergencyChoice';

export const EmergencyDetails = React.forwardRef((props: any, ref) => {
  const history = useHistory();
  const [helper, setHelper] = useState(null);

  const dispatchServices = () => {
    fetchNui<ServerPromiseResp<AudioEventArguments>>(EmergencyEvents.DISPATCH, {
      type: AudioTypes.START_CALL,
    }).then((data) => {
      console.log('played nui PLAY_AUDIO');
      DispatchIntro.play().then((playback) => {
        setTimeout(() => {}, DispatchIntro.duration * 1000);
      });
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
    }

    dispatchSound.play().then((playback) => {
      props.setContext(<></>);
      setTimeout(() => {
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
