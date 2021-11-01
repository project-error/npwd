import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import AddIcon from '@mui/icons-material/Add';
import { Fab } from '@mui/material';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'absolute',
    bottom: theme.spacing(5),
    right: theme.spacing(3),
  },
}));

interface INewMessageGroupButtonProps {
  onClick(): void;
}

export function NewMessageGroupButton({ onClick }: INewMessageGroupButtonProps) {
  const classes = useStyles();

  return (
    <Fab className={classes.root} color="primary" onClick={onClick}>
      <AddIcon />
    </Fab>
  );
}

export default NewMessageGroupButton;
