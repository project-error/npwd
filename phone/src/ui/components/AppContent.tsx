import React from 'react';
import { Box, Backdrop, Paper, BoxProps } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { AppContentTypes } from '../interface/InterfaceUI';

const useStyles = makeStyles(() => ({
  wrapper: {
    flex: 1,
  },
  box: {
    width: '100%',
    height: '100%', // allow application to fill entireity of space
  },
  backdrop: {
    position: 'absolute',
    zIndex: 1,
  },
  paper: {
    width: '100%',
    height: '100%', // allow application to fill entireity of space
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
      <Box flexGrow={1} className={classes.box} {...props}>
        <Paper
          square
          elevation={0}
          className={`${classes.paper} ${props.className}`}
          style={paperStyle}
        >
          {children}
        </Paper>
      </Box>
    </Paper>
  );
};
