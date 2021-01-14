import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Fab } from '@material-ui/core';
import CreateIcon from '@material-ui/icons/Create';

const useStyles = makeStyles(() => ({
  root: {
    position: 'absolute',
    bottom: '75px',
    right: '15px',
  },
  button: {
    background: '#00acee',
  },
}));

export function TweetButton({ openModal }) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Fab className={classes.button} color='primary' onClick={openModal}>
        <CreateIcon />
      </Fab>
    </div>
  );
}

export default TweetButton;
