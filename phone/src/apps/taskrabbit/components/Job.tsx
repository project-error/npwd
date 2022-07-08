import React from 'react';
import { Box, Button, Typography, Paper } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { grabRabbitTaskById } from '../hooks/state';
import { MessageEvents } from '@typings/messages';
import fetchNui from '../../../utils/fetchNui';
import { useLocation } from "react-router-dom";
import { useSnackbar } from '@os/snackbar/hooks/useSnackbar';
import { useHistory } from 'react-router';

const useStyles = makeStyles((theme) => ({
  buttonStyle : {
    width : "100%",
    color:"white",
    background: "#03bb85",
    "&:hover" :{
      background : '#121212',
    },
  },
  paper: {
    overflow: 'auto',
    display: 'flex',
    flexFlow: 'column',
    alignItems: 'flex',
    borderWidth: 2,
    height: 'auto',
    background: theme.palette.background.paper,
    marginBottom: 20,
    textAlign:'center',
  },
}));

export const Job: React.FC = () => {
  const classes = useStyles();
  const { addAlert } = useSnackbar();
  const history = useHistory();
  const search = useLocation().search;
  
  const id = new URLSearchParams(search).get('id');
  const job = grabRabbitTaskById(parseInt(id));

  const handleSetWaypoint = () => {
    // sets GPS waypoint.
    fetchNui(MessageEvents.MESSAGES_SET_WAYPOINT, {
      coords: job.blip_location,
    });
    // Alerts user of the GPS waypoint.
    addAlert({
      message: 'Job Location has been marked on your GPS.',
      type: 'success',
    });
    // Brings user back to homepage.
    history.goBack();
    history.goBack();
  };

  return (
    <Box height="100%" width="100%" p={2}>
      <Paper variant="outlined" className={classes.paper}>
        <div style={{ margin: 10 }}>
          <Typography style={{ margin: 5 }} variant="h5">
              {job.title}
          </Typography>
          <hr/>
          <Typography style={{ margin: 5 }} variant="h5">
            {job.description} 
          </Typography>
        </div>
        <Button className = { classes.buttonStyle } onClick={handleSetWaypoint}>Start Job Now</Button>
      </Paper>
    </Box>
  );
};