import React from 'react';
import CloseIcon from '@material-ui/icons/Close';
import {
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
  makeStyles,
  Theme,
} from '@material-ui/core';
import { INotification } from '../providers/NotificationsProvider';

const useStyles = makeStyles<Theme, { cantClose: boolean }>((theme) => ({
  closeNotifBtn: {
    position: 'absolute',
    right: '8px',
    top: '8px',
  },
  notificationItem: {
    paddingRight: ({ cantClose }) => (cantClose ? '8px' : '28px'),
    position: 'relative',
  },
}));

export const NotificationItem = ({
  onClose,
  onClickClose,
  ...notification
}: INotification & {
  onClose: (e: any) => void;
  onClickClose: (e: any) => void;
}) => {
  const { title, icon, content, cantClose, onClick } = notification;
  const classes = useStyles({ cantClose });
  return (
    <ListItem
      divider
      button
      onClick={(e) => {
        if (onClick) {
          onClick(notification);
          onClickClose(e);
        }
      }}
      className={classes.notificationItem}
    >
      {icon && <ListItemAvatar>{icon}</ListItemAvatar>}
      <ListItemText secondary={content}>{title}</ListItemText>
      {!cantClose && (
        <IconButton className={classes.closeNotifBtn} size="small" onClick={onClose}>
          <CloseIcon color="primary" />
        </IconButton>
      )}
    </ListItem>
  );
};
