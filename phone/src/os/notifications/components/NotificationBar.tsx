import React from 'react';
import {
  makeStyles,
  Typography,
  Grid,
  IconButton,
  Slide,
  Paper,
  Box,
  List,
  Divider,
} from '@material-ui/core';
import SignalIcon from '@material-ui/icons/SignalCellular3Bar';
import Battery90Icon from '@material-ui/icons/Battery90';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import Default from '../../../config/default.json';
import { useNotifications } from '../hooks/useNotifications';
import { NotificationItem } from './NotificationItem';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.default,
    height: '30px',
    width: '100%',
    color: theme.palette.text.primary,
    zIndex: 99,
    paddingLeft: '15px',
    paddingRight: '10px',
    position: 'relative',
    '&:hover': {
      cursor: 'pointer',
    },
  },
  item: {
    margin: '0 6px',
  },
  text: {
    position: 'relative',
    lineHeight: '30px',
    color: theme.palette.text.primary,
  },
  icon: {
    padding: '4px',
    color: theme.palette.text.primary,
  },
  drawer: {
    backgroundColor: theme.palette.background.default,
    width: '100%',
    position: 'absolute',
    top: '30px',
    zIndex: 98,
  },
  closeNotifBtn: {
    position: 'absolute',
    right: '8px',
    top: '8px',
  },
  notificationItem: {
    position: 'relative',
  },
  collapseBtn: {
    margin: '0 auto',
  },
}));

export const NotificationBar = () => {
  const classes = useStyles();

  const {
    icons,
    notifications,
    removeNotification,
    barUncollapsed,
    setBarUncollapsed,
  } = useNotifications();

  return (
    <>
      <Grid
        className={classes.root}
        container
        justify="space-between"
        wrap="nowrap"
        onClick={() => {
          setBarUncollapsed((curr) => !curr);
        }}
      >
        <Grid container item wrap="nowrap">
          {icons.map((notifIcon) => (
            <Grid
              item
              key={notifIcon.key}
              component={IconButton}
              className={classes.icon}
            >
              {notifIcon.icon}
            </Grid>
          ))}
        </Grid>
        <Grid container item wrap="nowrap" justify="flex-end" alignItems="center">
          <Grid item>
            <SignalIcon fontSize="small" />
          </Grid>
          <Grid item className={classes.item}>
            <Typography className={classes.text} variant="button">
              {Default.cellProvider}
            </Typography>
          </Grid>
          <Grid item>
            <Battery90Icon style={{ transform: 'rotate(90deg)', display: 'block' }} />
          </Grid>
        </Grid>
      </Grid>
      <Slide direction="down" in={barUncollapsed}>
        <Paper square className={classes.drawer}>
          <Box py={2}>
            <List>
              <Divider />
              {notifications.map((notification, idx) => (
                <NotificationItem
                  key={idx}
                  {...notification}
                  onClose={(e) => {
                    e.stopPropagation();
                    notification.onClose?.(notification);
                    if (notifications.length === 1) {
                      setBarUncollapsed(false);
                    }
                    removeNotification(idx);
                  }}
                  onClickClose={() => {
                    setBarUncollapsed(false);
                    if (!notification.cantClose) {
                      removeNotification(idx);
                    }
                  }}
                />
              ))}
            </List>
          </Box>
          <Box display="flex">
            <IconButton
              className={classes.collapseBtn}
              size="small"
              onClick={() => setBarUncollapsed(false)}
            >
              <ArrowDropUpIcon />
            </IconButton>
          </Box>
        </Paper>
      </Slide>
    </>
  );
};
