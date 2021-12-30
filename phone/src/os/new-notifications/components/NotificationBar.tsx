import React, { useEffect } from 'react';
import { Typography, Grid, IconButton, Slide, Paper, Box, List, Divider } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import SignalIcon from '@mui/icons-material/SignalCellular3Bar';
import Battery90Icon from '@mui/icons-material/Battery90';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import Default from '../../../config/default.json';
import { NotificationItem } from './NotificationItem';
import usePhoneTime from '../../phone/hooks/usePhoneTime';
import { NoNotificationText } from './NoNotificationText';
import { useNotifications } from '../hooks/useNotifications';
import { useHistory } from 'react-router-dom';
import { useNavbarUncollapsed } from '../state/notifications.state';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.default,
    height: '30px',
    width: '100%',
    color: theme.palette.text.primary,
    zIndex: 99,
    paddingLeft: '15px',
    paddingRight: '15px',
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
  const history = useHistory();
  const classes = useStyles();
  const time = usePhoneTime();

  const { allUnreadNotifications, markAsRead } = useNotifications();
  const [barUncollapsed, setBarUncollapsed] = useNavbarUncollapsed();

  useEffect(() => {
    if (allUnreadNotifications.length === 0) {
      setBarUncollapsed(false);
    }
  }, [allUnreadNotifications, setBarUncollapsed]);

  return (
    <>
      <Grid
        className={classes.root}
        container
        justifyContent="space-between"
        alignItems="center"
        wrap="nowrap"
        onClick={() => {
          setBarUncollapsed((curr) => !curr);
        }}
      >
        <Grid container item wrap="nowrap">
          {allUnreadNotifications.map((notification) => (
            <Grid item key={notification.uniqId} component={IconButton} className={classes.icon}>
              {notification.notificationIcon}
            </Grid>
          ))}
        </Grid>
        {time && (
          <Grid item className={classes.item}>
            <Typography className={classes.text} variant="button">
              {time}
            </Typography>
          </Grid>
        )}
        <Grid container item wrap="nowrap" justifyContent="flex-end" alignItems="center">
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
      <Slide direction="down" in={barUncollapsed} mountOnEnter unmountOnExit>
        <Paper square className={classes.drawer}>
          <Box py={1}>
            <List>
              <Divider />
              {allUnreadNotifications.map((notification, idx) => (
                <NotificationItem
                  key={idx}
                  {...notification}
                  onClose={() => {
                    markAsRead(notification.uniqId);
                    history.push(notification.path);
                  }}
                />
              ))}
            </List>
          </Box>
          <Box display="flex" flexDirection="column">
            {!allUnreadNotifications.length && <NoNotificationText />}
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
