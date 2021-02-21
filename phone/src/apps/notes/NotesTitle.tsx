import React from 'react';

import { makeStyles, Paper } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStickyNote } from '@fortawesome/free-solid-svg-icons';

const useStyles = makeStyles((theme) => ({
  header: {
    width: '100%',
    display: 'flex',
    flexFlow: 'row nowrap',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    height: '60px',
  },
  icon: {
    color: theme.palette.primary.main,
    fontSize: 40,
  },
}));

const NotesTitle = () => {
  const classes = useStyles();
  return (
    <Paper elevation={24} square variant='outlined' className={classes.header}>
      <FontAwesomeIcon icon={faStickyNote} className={classes.icon} size='lg' />
    </Paper>
  );
};

export default NotesTitle;
