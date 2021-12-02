import React from 'react';
import { darken, Theme } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import { green } from '@mui/material/colors';
import { Avatar, Badge, Button, Zoom } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { INotificationIcon } from '@os/notifications/providers/NotificationsProvider';
import { Tooltip } from './Tooltip';

const useStyles = makeStyles<Theme, { color: string; backgroundColor: string }>((theme) => ({
  root: {
    padding: 0,
    marginTop: theme.spacing(3),
  },
  avatar: {
    '&:hover': {
      backgroundColor: ({ backgroundColor }) => darken(backgroundColor, 0.1),
    },
    backgroundColor: ({ backgroundColor }) => backgroundColor,
    color: ({ color }) => color,
    boxShadow: theme.shadows[2],
    width: theme.spacing(8),
    height: theme.spacing(8),
    fontSize: theme.typography.h4.fontSize,
  },
  icon: {
    fontSize: theme.typography.h4.fontSize,
    width: theme.spacing(8),
    height: theme.spacing(8),
  },
  tooltip: {
    fontSize: 12,
  },
}));

export interface AppIconProps {
  id: string;
  nameLocale: string;
  Icon: React.ElementType;
  icon: React.ElementType;
  backgroundColor: string;
  color: string;
  notification: INotificationIcon;
}

export const AppIcon: React.FC<AppIconProps> = ({
  id,
  nameLocale,
  Icon,
  backgroundColor,
  color,
  icon,
  notification,
}) => {
  const [t] = useTranslation();
  const classes = useStyles({
    backgroundColor: backgroundColor || green[50],
    color: color || green[400],
  });

  return (
    <Tooltip
      arrow
      key={id}
      title={t(nameLocale)}
      placement="top"
      classes={{ tooltip: classes.tooltip }}
      TransitionComponent={Zoom}
    >
      <Button className={classes.root}>
        <Badge
          color="error"
          badgeContent={notification?.badge}
          invisible={!notification || notification.badge < 2}
        >
          {Icon ? (
            <Icon className={classes.icon} fontSize="large" />
          ) : (
            <Avatar className={classes.avatar}>{icon || t(nameLocale)}</Avatar>
          )}
        </Badge>
      </Button>
    </Tooltip>
  );
};
