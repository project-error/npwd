import React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton, ListItem, ListItemAvatar, ListItemText, Theme } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { INotification } from '../providers/NotificationsProvider';
import { useCurrentCallValue } from '@os/call/hooks/state';

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
  const call = useCurrentCallValue();

  return (
    <ListItem
      divider
      button
      onClick={(e) => {
        if (onClick && !call) {
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
