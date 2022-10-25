import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { Fab } from '@mui/material';
import CreateIcon from '@mui/icons-material/Create';
import { toggleKeys } from '@ui/components';

const useStyles = makeStyles(() => ({
  root: {
    position: 'absolute',
    bottom: '75px',
    right: '10px',
  },
  button: {
    background: '#00acee',
  },
}));

export function TweetButton({ openModal }) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Fab
        className={classes.button}
        color="primary"
        onClick={openModal}
        onMouseUp={() => {
          toggleKeys(false);
        }}
      >
        <CreateIcon />
      </Fab>
    </div>
  );
}

export default TweetButton;
