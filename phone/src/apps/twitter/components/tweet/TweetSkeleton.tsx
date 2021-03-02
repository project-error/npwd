import React from 'react';
import Divider from '@material-ui/core/Divider';
import { makeStyles } from '@material-ui/core/styles';
import Skeleton from '@material-ui/lab/Skeleton';

const useStyles = makeStyles({
  root: {
    width: '100%',
    padding: '15px',
    display: 'flex',
    flexFlow: 'row nowrap',
    marginTop: '3px',
    marginBottom: '3px',
  },
  left: {},
  right: {
    marginLeft: '15px',
    marginTop: '-5px',
  },
});

export default function TweetSkeleton() {
  const classes = useStyles();
  return (
    <>
      <div className={classes.root}>
        <div className={classes.left}>
          <Skeleton variant="circle" width={60} height={60} />
        </div>
        <div className={classes.right}>
          <Skeleton variant="text" />
          <Skeleton variant="rect" width={250} height={118} />
        </div>
      </div>

      <Divider />
    </>
  );
}
