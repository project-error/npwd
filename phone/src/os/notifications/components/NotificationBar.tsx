import React from 'react';
import { makeStyles, Typography, Grid, IconButton } from '@material-ui/core';
import { fade } from '@material-ui/core/styles/colorManipulator';
import SignalIcon from '@material-ui/icons/SignalCellular3Bar';
import Battery90Icon from '@material-ui/icons/Battery90';
import Default from '../../../config/default.json';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.default,
    height: '25px',
    width: '100%',
    color: theme.palette.text.primary,
    zIndex: 2,
    paddingLeft: '10px',
    paddingRight: '10px',
  },
  item: {
    margin: '0 6px',
  },
  text: {
    position: 'relative',
    bottom: '4px',
    color: theme.palette.text.primary,
  },
  icon: {
    padding: '4px',
    color: theme.palette.text.primary,
  },
}));

interface INotification {
  key: string;
  icon: JSX.Element;
}

interface IProps {
  notifications?: INotification[];
}

export const NotificationBar = ({ notifications = [] }: IProps) => {
  const classes = useStyles();
  return (
    <Grid
      className={classes.root}
      container
      justify='space-between'
      wrap='nowrap'
    >
      <Grid container item wrap='nowrap'>
        {notifications.map((notification) => (
          <Grid
            item
            key={notification.key}
            component={IconButton}
            className={classes.icon}
          >
            {notification.icon}
          </Grid>
        ))}
      </Grid>
      <Grid container item wrap='nowrap' justify='flex-end'>
        <Grid item>
          <SignalIcon fontSize='small' />
        </Grid>
        <Grid item className={classes.item}>
          <Typography className={classes.text} variant='button'>
            {Default.cellProvider}
          </Typography>
        </Grid>
        <Grid item>
          <Battery90Icon style={{ transform: 'rotate(90deg)' }} />
        </Grid>
      </Grid>
    </Grid>
  );
};
