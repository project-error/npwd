import React from 'react';
import { Box } from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    backgroundColor: theme.palette.background.default,
  },
}));

const ContactsSearch = () => {
  const classes = useStyles();

  return <Box flexGrow={1} className={classes.root}></Box>;
};

export default ContactsSearch;
