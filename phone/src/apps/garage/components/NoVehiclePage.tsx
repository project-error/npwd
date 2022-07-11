import React from 'react';
import { Button, Paper, Typography } from '@mui/material';
import { MessageEvents } from '@typings/messages';
import { useSnackbar } from '@os/snackbar/hooks/useSnackbar';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import fetchNui from '@utils/fetchNui';
import makeStyles from '@mui/styles/makeStyles';
import { useHistory } from 'react-router';

const useStyles = makeStyles((theme) => ({
  newJoiner: {
    width: '100%',
    marginTop: '3px',
    transition: 'opacity 0.5s ease',
    textAlign: 'center',
    flexFlow: 'column nowrap',
    marginBottom: '10px',
  },
  newJoinerInfoButton: {
    marginBottom: '10px',
    width: '100%',
  },
}));

export const NoVehiclePage: React.FC = () => {
  const { addAlert } = useSnackbar();
  const classes = useStyles();
  const history = useHistory();
  const pingPDM = () => {
    // sets GPS to PDM.
    fetchNui(MessageEvents.MESSAGES_SET_WAYPOINT, {
      coords: [-34.7558, -1102.3901],
    });
    addAlert({
      message: '📍 PDM has been marked on your map.',
      type: 'success',
    });
  };
  const openTaskRabbitApp = () => {
    history.push('/taskrabbit');
  };
  const openTwitter = () => {
    history.push('/twitter');
  };
  return (
    <Paper className={classes.newJoiner}>
      <Typography style={{ margin: 5 }} variant="h6">
        <WarningRoundedIcon color={'warning'} /> It seems you have no vehicles
      </Typography>
      <hr />
      <Button onClick={pingPDM} className={classes.newJoinerInfoButton}>
        📍 Premium Deluxe Motorsports
      </Button>
      <br />
      <Button onClick={openTaskRabbitApp} className={classes.newJoinerInfoButton}>
        💵 Early Career Gigs
      </Button>
      <br />
      <Button onClick={openTwitter} className={classes.newJoinerInfoButton}>
        🤼 Build Your Network
      </Button>
    </Paper>
  );
};
