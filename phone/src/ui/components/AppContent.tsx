import React from 'react';
import { Backdrop, Paper, BoxProps } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { AppContentTypes } from '../interface/InterfaceUI';

const useStyles = makeStyles(() => ({
  wrapper: {
    flex: 1,
    flexDirection: 'column',
    display: 'flex',
  },
  backdrop: {
    position: 'absolute',
    zIndex: 1,
  },
  paper: {
    width: '100%',
    flex: '1 1 auto', // allow application to fill entireity of space
  },
}));

export const AppContent: React.FC<AppContentTypes & BoxProps> = ({
  children,
  paperStyle,
  backdrop,
  onClickBackdrop,
  ...props
}) => {
  const classes = useStyles();

  return (
    <Paper
      className={classes.wrapper}
      square
      style={backdrop ? { overflow: 'hidden' } : { overflow: 'auto' }}
    >
      <Backdrop className={classes.backdrop} open={backdrop || false} onClick={onClickBackdrop} />
      <Paper
        sx={{ flexGrow: 1 }}
        square
        elevation={0}
        className={`${classes.paper} ${props.className}`}
        style={paperStyle}
      >
        {children}
      </Paper>
    </Paper>
  );
};
