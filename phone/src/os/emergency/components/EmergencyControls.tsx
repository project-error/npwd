import React from 'react';
import CallIcon from '@mui/icons-material/Call';
import CallEndIcon from '@mui/icons-material/CallEnd';
import { useCall } from '../hooks/useCall';
import { useCallModal } from '../hooks/useCallModal';
import { StatusIconButton } from '@ui/components/StatusIconButton';
import { Box, List, ListItem, ListItemIcon, ListItemButton, ListItemText } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { useHistory } from 'react-router-dom';
import LocalPoliceIcon from '@mui/icons-material/LocalPolice';
import HealingIcon from '@mui/icons-material/Healing';
import { hangup } from '@os/emergency/utils';
const useStyles = makeStyles({
  icon: {
    color: 'white',
    boxShadow: '0 .5rem 3rem -.25em rgba(0,0,0,.3)',
  },
  iconWrapper: {
    height: 60,
    width: 60,
  },
  smallIconWrapper: {
    height: 40,
    width: 40,
  },
});

export const EmergencyControls = ({ isSmall }: { isSmall?: boolean }) => {
  const classes = useStyles();
  const history = useHistory();

  const handleEndCall = (e) => {
    e.stopPropagation();
  };
  // We display only the hang up if the call is accepted
  // or we are the one calling
  return (
    <Box display="flex" justifyContent="center" px={2} my={2}>
      <StatusIconButton
        color="error"
        size={isSmall ? 'small' : 'medium'}
        onClick={handleEndCall}
        className={isSmall ? classes.smallIconWrapper : classes.iconWrapper}
      >
        <CallEndIcon className={classes.icon} onClick={() => hangup(history)} />
      </StatusIconButton>
    </Box>
  );
};
