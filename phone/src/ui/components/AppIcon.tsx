import React from 'react';
import { darken, makeStyles, Theme } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import { green } from '@material-ui/core/colors';
import { Badge, Button, Tooltip, Zoom } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles<Theme, { color: string; backgroundColor: string }>(
  (theme) => ({
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
    tooltip: {
      fontSize: 12,
    },
  })
);

export const AppIcon = ({
  id,
  nameLocale,
  name,
  icon,
  backgroundColor,
  color,
  notification,
}) => {
  const { t } = useTranslation();
  const classes = useStyles({
    backgroundColor: backgroundColor || green[50],
    color: color || green[400],
  });

  return (
    <Tooltip
      arrow
      key={id}
      title={t(nameLocale)}
      placement='top'
      classes={{ tooltip: classes.tooltip }}
      TransitionComponent={Zoom}
    >
      <Button className={classes.root}>
        <Badge
          color='error'
          badgeContent={notification?.badge}
          invisible={!notification || notification.badge < 2}
        >
          <Avatar className={classes.avatar}>
            {icon || name[0].toUpperCase()}
          </Avatar>
        </Badge>
      </Button>
    </Tooltip>
  );
};
