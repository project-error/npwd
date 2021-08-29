import React from 'react';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import { makeStyles, Typography } from '@material-ui/core';

const useStyles = makeStyles({
  root: {
    zIndex: 10000,
  },
  msg: {
    maxWidth: '300px',
    wordWrap: 'break-word',
    fontSize: '1.1em',
  },
});

export const Alert: React.FC<AlertProps> = ({ children, ...props }) => {
  const classes = useStyles();
  return (
    <MuiAlert className={classes.root} elevation={4} variant="filled" {...props}>
      <Typography className={classes.msg}>{children}</Typography>
    </MuiAlert>
  );
};

export default Alert;
