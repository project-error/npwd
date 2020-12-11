import React from 'react';
import Paper from '@material-ui/core/Paper';
import ContactsIcon from '@material-ui/icons/Contacts';
import useStyles from './styles.contacts';

export const ContactTitle = () => {
  const classes = useStyles();
  return (
    <Paper className={classes.root} square variant='outlined' elevation={24}>
      <ContactsIcon className={classes.icon} />
    </Paper>
  );
};
