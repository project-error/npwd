import React, { forwardRef } from 'react';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { Typography } from '@mui/material';

import makeStyles from '@mui/styles/makeStyles';

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

export const Alert: React.FC<AlertProps> = forwardRef((props, ref) => {
  const classes = useStyles();
  return (
    <MuiAlert className={classes.root} elevation={4} variant="filled" {...props} ref={ref}>
      <Typography className={classes.msg}>{props.children}</Typography>
    </MuiAlert>
  );
});

export default Alert;
