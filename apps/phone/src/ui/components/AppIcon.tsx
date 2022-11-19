import React from 'react';
import { darken, Theme } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import { green } from '@mui/material/colors';
import { Zoom } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { INotificationIcon } from '@os/notifications/providers/NotificationsProvider';
import { Tooltip } from './Tooltip';

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

  return (
    <Tooltip arrow key={id} title={t(nameLocale)} placement="top" TransitionComponent={Zoom}>
      {/*<Button disableTouchRipple disableRipple disableFocusRipple className={classes.root}>
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
      </Button>*/}
      <button className="mt-5">
        {Icon ? (
          <Icon className="" fontSize="large" />
        ) : (
          <div className="bg-gradient-to-b from-blue-500 to-blue-400 py-3 px-3 rounded-lg drop-shadow-lg">
            <span className="text-white">{icon || t(nameLocale)}</span>
          </div>
        )}
      </button>
    </Tooltip>
  );
};
