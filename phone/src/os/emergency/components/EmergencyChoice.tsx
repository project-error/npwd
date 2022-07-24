import React from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import LocalPoliceIcon from '@mui/icons-material/LocalPolice';
import HealingIcon from '@mui/icons-material/Healing';
import fetchNui from '@utils/fetchNui';
import { ServerPromiseResp } from '@typings/common';
import { AudioTypes, EmergencyEvents, EmergencyServices } from '@typings/emergency';
import { setContext } from '@sentry/react';
import { DispatchAmbulance, DispatchIntro, DispatchPolice } from '@os/emergency/config';
import { hangup } from '@os/emergency/utils';
import { useHistory } from 'react-router';

export const EmergencyChoice = React.forwardRef((props: any, ref) => {
  const history = useHistory();
  return (
    <Box ref={ref}>
      <List
        sx={{ width: '100%', maxWidth: 360, bgcolor: '#3d3939', borderRadius: '5px' }}
        aria-label="contacts"
      >
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => {
              DispatchPolice.play().then((playback) => {
                props.setContext(<></>);
                setTimeout(() => {
                  hangup(history);
                }, DispatchPolice.duration * 1000);
              });
            }}
          >
            <ListItemIcon>
              <LocalPoliceIcon sx={{ color: 'blue' }} />
            </ListItemIcon>
            <ListItemText style={{ textAlign: 'center' }} primary="Police" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => {
              DispatchAmbulance.play().then((playback) => {
                props.setContext(<></>);
                setTimeout(() => {
                  hangup(history);
                }, DispatchAmbulance.duration * 1000);
              });
            }}
          >
            <ListItemIcon>
              <HealingIcon sx={{ color: 'red' }} />
            </ListItemIcon>
            <ListItemText style={{ textAlign: 'center' }} primary="Ambulance" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );
});
