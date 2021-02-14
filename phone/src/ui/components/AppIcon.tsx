import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import { green } from '@material-ui/core/colors';
import { Button } from '@material-ui/core';

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

export const AppIcon = ({ id, name, icon, backgroundColor, color }) => {
  const classes = useStyles({
    backgroundColor: backgroundColor || green[50],
    color: color || green[400],
  });

  return (
    <Button className={classes.root}>
      <Avatar className={classes.avatar}>
        {icon || name[0].toUpperCase()}
      </Avatar>
    </Button>
  );
};
