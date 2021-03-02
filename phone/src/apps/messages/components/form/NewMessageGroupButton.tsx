import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import { Fab } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(3),
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
    <Fab className={classes.root} color='primary' onClick={onClick}>
      <AddIcon />
    </Fab>
  );
}

export default NewMessageGroupButton;
