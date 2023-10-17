import React from 'react';
import { Backdrop, Paper, BoxProps } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { AppContentTypes } from '../interface/InterfaceUI';
import { LoadingSpinner } from '@ui/components/LoadingSpinner';
import { classNames } from '@utils/css';

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

  return (
    <div
      className="flex flex-col flex-1 bg-neutral-100 dark:bg-neutral-900"
      style={backdrop ? { overflow: 'hidden' } : { overflow: 'auto' }}
    >
      <Backdrop className={classes.backdrop} open={backdrop || false} onClick={onClickBackdrop} />
      <div className={classNames('flex-auto w-full grow', props.className)} style={paperStyle}>
        {!disableSuspenseHandler ? (
          <React.Suspense fallback={<LoadingSpinner />}>{children}</React.Suspense>
        ) : (
          { children }
        )}
      </div>
    </div>
  );
};
