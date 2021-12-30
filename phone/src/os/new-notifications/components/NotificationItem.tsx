import React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton, ListItem, ListItemAvatar, ListItemText, Theme } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { INotification } from '../../notifications/providers/NotificationsProvider';
import { UnreadNotification } from '../../../../../typings/notifications';

const useStyles = makeStyles((theme) => ({
  closeNotifBtn: {
    position: 'absolute',
    right: '8px',
    top: '8px',
  },
  notificationItem: {
    paddingRight: '28px',
    position: 'relative',
  },
}));

export const NotificationItem = ({
  onClose,
  ...notification
}: UnreadNotification & {
  onClose: () => void;
}) => {
  const { icon, message } = notification;
  const classes = useStyles();

  return (
    <ListItem divider button onClick={onClose} className={classes.notificationItem}>
      {icon && <ListItemAvatar>{icon}</ListItemAvatar>}
      <ListItemText secondary={message} />
    </ListItem>
  );
};
