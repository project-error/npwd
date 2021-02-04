import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import { green } from '@material-ui/core/colors';
import { Button } from '@material-ui/core';
import Nui from '../../os/nui-events/utils/Nui';
import { AppConfiguration } from '../../os/apps/hooks/useApps';

interface IStyles {
  root: any;
  avatar: any;
}

const useStyles = makeStyles(
  (theme): IStyles => ({
    root: {
      display: 'flex',
      '& > *': {
        margin: theme.spacing(1),
      },
      padding: 0,
    },
    avatar: {
      backgroundColor: ({ backgroundColor }) => backgroundColor,
      color: ({ color }) => color,
      width: theme.spacing(7),
      height: theme.spacing(7),
      fontSize: theme.typography.h4.fontSize,
    },
  })
);

export const AppIcon = ({ id, icon, backgroundColor, color }: AppConfiguration) => {
  const classes = useStyles({
    backgroundColor: backgroundColor || green[50],
    color: color || green[400],
  });

  const openAppCallback = () => {
    Nui.send(`phone:app:${id}`);
  };

  return (
    <Button onClick={openAppCallback} className={classes.root}>
      <Avatar className={classes.avatar}>
        {icon}
      </Avatar>
    </Button>
  );
};
