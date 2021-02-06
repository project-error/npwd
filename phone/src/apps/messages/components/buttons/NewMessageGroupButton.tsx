import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Fab } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

const useStyles = makeStyles(() => ({
  root: {
    position: 'absolute',
    bottom: '25px',
    right: '15px',
  },
}));

interface INewMessageGroupButtonProps {
  onClick(): void;
}

export function NewMessageGroupButton({
  onClick,
}: INewMessageGroupButtonProps) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Fab color='primary' onClick={onClick}>
        <AddIcon />
      </Fab>
    </div>
  );
}

export default NewMessageGroupButton;
