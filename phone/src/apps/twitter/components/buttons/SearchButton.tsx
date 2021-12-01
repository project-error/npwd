import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { Fab } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'absolute',
    bottom: '75px',
    right: '10px',
  },
}));

export function ProfileUpdateButton({ handleClick }) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Fab color="primary" onClick={handleClick}>
        <SearchIcon />
      </Fab>
    </div>
  );
}

export default ProfileUpdateButton;
