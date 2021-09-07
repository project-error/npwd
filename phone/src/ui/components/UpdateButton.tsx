import React, { useState, useEffect } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { Fab } from '@mui/material';
import PublishIcon from '@mui/icons-material/Publish';

const useStyles = makeStyles({
  root: {
    position: 'absolute',
    bottom: '15px',
    right: '15px',
  },
});

const MINIMUM_LOAD_TIME = 750;

interface ProfileUpdateButtonProps {
  handleClick: () => void;
  loading: boolean;
}

export const ProfileUpdateButton: React.FC<ProfileUpdateButtonProps> = ({
  handleClick,
  loading,
}) => {
  const classes = useStyles();
  const [minimumLoadPassed, setMimimumLoadPassed] = useState(true);

  useEffect(() => {
    setMimimumLoadPassed(false);
    const timeout = window.setTimeout(() => {
      setMimimumLoadPassed(true);
    }, MINIMUM_LOAD_TIME);
    return () => window.clearTimeout(timeout);
  }, [loading]);

  const isLoading = loading || !minimumLoadPassed;

  return (
    <div className={classes.root}>
      <Fab color="primary" onClick={handleClick} disabled={isLoading}>
        <PublishIcon />
      </Fab>
    </div>
  );
};

export default ProfileUpdateButton;
