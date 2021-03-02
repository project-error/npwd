import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Skeleton from '@material-ui/lab/Skeleton';

const useStyles = makeStyles({
  root: {
    margin: '0px 0px 12px 8px',
  },
  skeleton: {
    borderRadius: '20px',
    transform: 'none',
  },
});

export default function MessageSkeleton({ height, isMine = false }) {
  const classes = useStyles();

  const marginLeft = isMine ? '60px' : '8px';
  return (
    <div className={classes.root} style={{ marginLeft, height: `${height}px` }}>
      <Skeleton className={classes.skeleton} variant="text" width={325} height={height} />
    </div>
  );
}
