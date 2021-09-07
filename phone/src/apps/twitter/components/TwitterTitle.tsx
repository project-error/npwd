import React from 'react';
import Paper from '@mui/material/Paper';
import makeStyles from '@mui/styles/makeStyles';
import TwitterIcon from '@mui/icons-material/Twitter';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '60px',
    width: '100%',
    display: 'flex',
    flexFlow: 'row nowrap',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#424242',
  },
  icon: {
    color: '#00acee',
    fontSize: 30,
  },
}));

export function TwitterTitle() {
  const classes = useStyles();
  return (
    <Paper elevation={24} variant="outlined" square className={classes.root}>
      <TwitterIcon className={classes.icon} />
    </Paper>
  );
}

export default TwitterTitle;
