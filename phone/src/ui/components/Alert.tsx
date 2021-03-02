import React from 'react';
import MuiAlert from '@material-ui/lab/Alert';
import { makeStyles, Typography } from '@material-ui/core';

const useStyles = makeStyles({
  root: {
    zIndex: 10000,
  },
  msg: {
    maxWidth: '300px',
    wordWrap: 'break-word',
    fontSize: '1em',
  },
});

export function Alert({ children, ...props }) {
  const classes = useStyles();
  return (
    <MuiAlert className={classes.root} elevation={6} variant="filled" {...props}>
      <Typography className={classes.msg}>{children}</Typography>
    </MuiAlert>
  );
}

export default Alert;
