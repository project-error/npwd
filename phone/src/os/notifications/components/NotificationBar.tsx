import React, { useEffect } from 'react';
import { Typography, Grid, IconButton, Slide, Paper, Box, List, Divider } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import SignalIcon from '@mui/icons-material/SignalCellular3Bar';
import Battery90Icon from '@mui/icons-material/Battery90';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import Default from '../../../config/default.json';
import { useNotifications } from '../hooks/useNotifications';
import { NotificationItem } from './NotificationItem';
import usePhoneTime from '../../phone/hooks/usePhoneTime';
import { NoNotificationText } from './NoNotificationText';
import { usePlayer } from '@os/phone/hooks/usePlayer';
import { usePhone } from '@os/phone/hooks/usePhone';

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
  const classes = useStyles();

  const { icons, notifications, removeNotification, barUncollapsed, setBarUncollapsed } =
    useNotifications();

  const time = usePhoneTime();
  const source = usePlayer();
  const { ResourceConfig } = usePhone();

  useEffect(() => {
    if (notifications.length === 0) {
      setBarUncollapsed(false);
    }
  }, [notifications, setBarUncollapsed]);

  if (!ResourceConfig) return null;
  const { showId } = ResourceConfig.general;

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
          {icons.map((notifIcon) => (
            <Grid item key={notifIcon.key} component={IconButton} className={classes.icon}>
              {notifIcon.icon}
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
          {showId && (
            <Grid sx={{ marginRight: 1 }} item>
              <Typography className={classes.text} variant="button">
                ID: {source}
              </Typography>
            </Grid>
          )}
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
              {notifications.map((notification, idx) => (
                <NotificationItem
                  key={idx}
                  {...notification}
                  onClose={(e) => {
                    e.stopPropagation();
                    notification.onClose?.(notification);
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
          <Box display="flex" flexDirection="column">
            {!notifications.length && <NoNotificationText />}
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
