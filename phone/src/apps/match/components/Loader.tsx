import React from 'react';
import { Box, CircularProgress } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles({
  root: {
    height: '100%',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
  },
  progress: {
    marginTop: '140px',
  },
});

function Loader() {
  const classes = useStyles();
  return (
    <Box className={classes.root}>
      <CircularProgress size={60} className={classes.progress} />
    </Box>
  );
}

export default Loader;
