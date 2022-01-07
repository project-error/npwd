import React from 'react';
import { Backdrop, Paper, BoxProps } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { AppContentTypes } from '../interface/InterfaceUI';
import { LoadingSpinner } from '@ui/components/LoadingSpinner';

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
  disableSuspenseHandler,
  onClickBackdrop,
  ...props
}) => {
  const classes = useStyles();

  const ChildElements = () => (
    <>
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
    </>
  );

  return (
    <Paper
      className={classes.wrapper}
      square
      style={backdrop ? { overflow: 'hidden' } : { overflow: 'auto' }}
    >
      {!disableSuspenseHandler ? (
        <React.Suspense fallback={<LoadingSpinner />}>
          <ChildElements />
        </React.Suspense>
      ) : (
        <ChildElements />
      )}
    </Paper>
  );
};
