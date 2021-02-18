import React, { useState } from 'react';
import {
  makeStyles,
  Typography,
  Grid,
  IconButton,
  Slide,
  Paper,
  Box,
  List,
  ListItem,
  ListItemText,
  Divider,
  ListItemAvatar,
} from '@material-ui/core';
import SignalIcon from '@material-ui/icons/SignalCellular3Bar';
import CloseIcon from '@material-ui/icons/Close';
import Battery90Icon from '@material-ui/icons/Battery90';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import Default from '../../../config/default.json';
import { useNotifications } from '../hooks/useNotifications';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.default,
    height: '30px',
    width: '100%',
    color: theme.palette.text.primary,
    zIndex: 10,
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
    zIndex: 9,
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

export const NotificationBar = ({ forceUncollapse }: { forceUncollapse: boolean }) => {
  const classes = useStyles();
  const history = useHistory();

  const { icons, notifications, removeNotification } = useNotifications();

  const [uncollapsed, setUncollapsed] = useState<boolean>(false);

  return (
    <>
      <Grid
        className={classes.root}
        container
        justify='space-between'
        wrap='nowrap'
        onClick={() => {
          setUncollapsed(!uncollapsed);
        }}
      >
        <Grid container item wrap='nowrap'>
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
        <Grid
          container
          item
          wrap='nowrap'
          justify='flex-end'
          alignItems='center'
        >
          <Grid item>
            <SignalIcon fontSize='small' />
          </Grid>
          <Grid item className={classes.item}>
            <Typography className={classes.text} variant='button'>
              {Default.cellProvider}
            </Typography>
          </Grid>
          <Grid item>
            <Battery90Icon
              style={{ transform: 'rotate(90deg)', display: 'block' }}
            />
          </Grid>
        </Grid>
      </Grid>
      <Slide direction='down' in={forceUncollapse || uncollapsed}>
        <Paper square className={classes.drawer}>
          <Box p={2}>
            <List>
              <Divider />
              {notifications.map(({ href, title, content, icon }, idx) => (
                <ListItem
                  divider
                  button
                  onClick={() => {
                    if (href) {
                      history.push(href);
                      setUncollapsed(false);
                      removeNotification(idx);
                    }
                  }}
                  className={classes.notificationItem}
                  key={idx}
                >
                  {icon && <ListItemAvatar>{icon}</ListItemAvatar>}
                  <ListItemText secondary={content}>{title}</ListItemText>
                  <IconButton
                    className={classes.closeNotifBtn}
                    size='small'
                    onClick={(e) => {
                      e.stopPropagation();
                      if (notifications.length === 1) {
                        setUncollapsed(false);
                      }
                      removeNotification(idx);
                    }}
                  >
                    <CloseIcon color='primary' />
                  </IconButton>
                </ListItem>
              ))}
            </List>
          </Box>
          <Box display='flex'>
            <IconButton
              className={classes.collapseBtn}
              size='small'
              onClick={() => setUncollapsed(false)}
            >
              <ArrowDropUpIcon />
            </IconButton>
          </Box>
        </Paper>
      </Slide>
    </>
  );
};
