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

export const EmergencyChoice = (props: any) => {
  return (
    <Box>
      <List
        sx={{ width: '100%', maxWidth: 360, bgcolor: '#3d3939', borderRadius: '5px' }}
        aria-label="contacts"
      >
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => {
              fetchNui<ServerPromiseResp>(EmergencyEvents.DISPATCH, EmergencyServices.POLICE).then(
                () => {},
              );
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
              fetchNui<ServerPromiseResp>(
                EmergencyEvents.DISPATCH,
                EmergencyServices.AMBULANCE,
              ).then(() => {});
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
};
