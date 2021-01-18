import React from 'react';
import { Box, IconButton, InputBase, Paper } from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';
import PhoneIcon from '@material-ui/icons/Phone';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    textAlign: 'right',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    paddingLeft: theme.spacing(5),
    paddingRight: theme.spacing(5),
    display: 'flex',
    height: 100,
  },
  input: {
    flex: 1,
    fontSize: theme.typography.h6.fontSize,
  },
  iconBtn: {
    padding: 10,
  },
}));

export const DialerInput = () => {
  const classes = useStyles();

  return (
    <Box component={Paper} className={classes.root}>
      <InputBase placeholder='Enter a number' className={classes.input} />
      <IconButton className={classes.iconBtn}>
        <PhoneIcon />
      </IconButton>
    </Box>
  );
};
